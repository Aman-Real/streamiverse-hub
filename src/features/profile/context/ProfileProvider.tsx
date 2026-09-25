import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { PROFILE_CONFIG } from "@/config/profile.config";
import * as authApi from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import * as profileApi from "@/features/profile/api/profile.api";
import { ProfileContext, type ProfileContextValue } from "@/features/profile/context/ProfileContext";
import type { UserProfile } from "@/features/profile/types";
import { getProfileSaveErrorMessage } from "@/features/profile/utils/profileErrors";
import { cropImageToSquareDataUrl } from "@/lib/image";

/** The profile tagged with the account it belongs to, so a sign-out never shows the previous account's details. */
interface LoadedProfile {
  uid: string;
  profile: UserProfile | null;
}

const NOT_SIGNED_IN = "Sign in to change your profile.";

/** Runs a profile write and turns any failure into an Error whose message can be shown as-is. */
const withReadableErrors = async (write: () => Promise<unknown>) => {
  try {
    await write();
  } catch (error) {
    console.error("[Profile] Save failed:", error);
    throw new Error(getProfileSaveErrorMessage(error));
  }
};

/**
 * The signed-in account's users/{uid} document, synced live, so a plan change made by the server shows
 * up without a reload. The first sign-in creates the document. Also owns the profile edits (name, photo).
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

  const updateDisplayName = useCallback(
    async (name: string) => {
      if (!user) throw new Error(NOT_SIGNED_IN);
      const trimmed = name.trim();
      await withReadableErrors(() =>
        Promise.all([profileApi.saveDisplayName({ ...user, name: trimmed }), authApi.updateAuthDisplayName(trimmed)]),
      );
    },
    [user],
  );

  const updatePhoto = useCallback(
    async (file: File) => {
      if (!user) throw new Error(NOT_SIGNED_IN);
      await withReadableErrors(async () => {
        const photoUrl = await cropImageToSquareDataUrl(file, PROFILE_CONFIG.photo);
        await profileApi.savePhotoUrl(user, photoUrl);
      });
    },
    [user],
  );

  const removePhoto = useCallback(async () => {
    if (!user) throw new Error(NOT_SIGNED_IN);
    await withReadableErrors(() => profileApi.savePhotoUrl(user, null));
  }, [user]);

  const value = useMemo<ProfileContextValue>(() => {
    const current = uid && loaded?.uid === uid ? loaded : null;
    return {
      profile: current?.profile ?? null,
      loading: status === "loading" || (Boolean(uid) && !current),
      updateDisplayName,
      updatePhoto,
      removePhoto,
    };
  }, [uid, loaded, status, updateDisplayName, updatePhoto, removePhoto]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
