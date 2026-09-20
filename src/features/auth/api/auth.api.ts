import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { APP_CONFIG } from "@/config/app.config";
import type { AuthUser } from "@/features/auth/types";
import { auth } from "@/lib/firebase";

/*
 * Every Firebase Auth call goes through this file, so components never import
 * firebase/auth directly and the rest of the app only sees AuthUser.
 */

/** Firebase's User -> the slimmer AuthUser the UI reads. */
export const toAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  name: user.displayName?.trim() || user.email?.split("@")[0] || `${APP_CONFIG.name} member`,
  email: user.email ?? "",
  photoUrl: user.photoURL,
});

/** Calls back now with the current user, then on every sign-in and sign-out. Returns the unsubscribe function. */
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);

export const signInWithEmail = async (email: string, password: string) =>
  (await signInWithEmailAndPassword(auth, email.trim(), password)).user;

/** Creates the account, then saves the name on it so the navbar can show initials straight away. */
export const signUpWithEmail = async (name: string, email: string, password: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(user, { displayName: name.trim() });
  return user;
};

const googleProvider = new GoogleAuthProvider();
// Always show the account chooser, so people signed into several Google accounts can pick one.
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Signs in with Google in a popup; a first-time Google user gets an account automatically. */
export const signInWithGoogle = async () => (await signInWithPopup(auth, googleProvider)).user;

/** With email enumeration protection on, this succeeds whether or not an account exists for the email. */
export const sendPasswordReset = (email: string) => sendPasswordResetEmail(auth, email.trim());

export const signOutUser = () => signOut(auth);
