import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import * as authApi from "@/features/auth/api/auth.api";
import { AuthContext, type AuthContextValue } from "@/features/auth/context/AuthContext";
import type { AuthStatus, AuthUser } from "@/features/auth/types";
import * as profileApi from "@/features/profile/api/profile.api";

/** Who is signed in. Firebase keeps the session in the browser, so it survives reloads. */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(
    () =>
      authApi.subscribeToAuthChanges(firebaseUser => {
        setUser(firebaseUser ? authApi.toAuthUser(firebaseUser) : null);
        setStatus(firebaseUser ? "signedIn" : "signedOut");
      }),
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    await authApi.signInWithEmail(email, password);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const created = await authApi.signUpWithEmail(name, email, password);
    // Saving the name doesn't notify the auth listener, so publish the named user here.
    const named = authApi.toAuthUser(created);
    setUser(named);
    // The auth listener fires before the name is saved, so the profile document may already exist under the
    // email-based fallback name. The account is created either way, so a failure here is logged, not thrown.
    profileApi.saveDisplayName(named).catch(error => console.error("[Profile] Couldn't save the display name:", error));
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await authApi.signInWithGoogle();
  }, []);

  const sendPasswordReset = useCallback((email: string) => authApi.sendPasswordReset(email), []);

  const signOut = useCallback(() => authApi.signOutUser(), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, signIn, signUp, signInWithGoogle, sendPasswordReset, signOut }),
    [user, status, signIn, signUp, signInWithGoogle, sendPasswordReset, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
