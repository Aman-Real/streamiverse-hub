import { ReactNode, useEffect, useMemo, useState } from "react";
import * as authApi from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import * as profileApi from "@/features/profile/api/profile.api";
import { ProfileContext, type ProfileContextValue } from "@/features/profile/context/ProfileContext";
import type { UserProfile } from "@/features/profile/types";

/** The profile tagged with the account it belongs to, so a sign-out never shows the previous account's details. */
interface LoadedProfile {
  uid: string;
  profile: UserProfile | null;
}

/**
 * The signed-in account's users/{uid} document, synced live, so a plan change made by the server shows
 * up without a reload. The first sign-in creates the document.
 */
export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, status } = useAuth();
  const uid = user?.uid;
  const [loaded, setLoaded] = useState<LoadedProfile | null>(null);

  useEffect(() => {
    if (!user) return;
    profileApi.ensureUserProfile(user).catch(error => console.error("[Profile] Couldn't create the profile:", error));
  }, [user]);

  useEffect(() => {
    if (!uid) return;
    return profileApi.subscribeToUserProfile(
      uid,
      profile => setLoaded({ uid, profile }),
      error => {
        // Signing out ends this listener with a permission error; that's expected, not a failure.
        if (authApi.getCurrentUid() !== uid) return;
        console.error("[Profile] Couldn't load the profile:", error);
        setLoaded({ uid, profile: null });
      },
    );
  }, [uid]);

  const value = useMemo<ProfileContextValue>(() => {
    const current = uid && loaded?.uid === uid ? loaded : null;
    return { profile: current?.profile ?? null, loading: status === "loading" || (Boolean(uid) && !current) };
  }, [uid, loaded, status]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
