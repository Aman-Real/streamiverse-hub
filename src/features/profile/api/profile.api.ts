import {
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type FirestoreError,
} from "firebase/firestore";
import type { AuthUser } from "@/features/auth/types";
import type { UserProfile } from "@/features/profile/types";
import { readDate, readString } from "@/lib/firestoreData";
import { firestoreRefs } from "@/lib/firestoreRefs";

/*
 * Every read and write of users/{uid} goes through this file. firestore.rules lets the browser create the
 * document once, on the free plan, and afterwards change only displayName and email; the plan is server-owned.
 */

const toProfile = (data: DocumentData): UserProfile => ({
  displayName: readString(data.displayName),
  email: readString(data.email),
  plan: data.plan === "pro" ? "pro" : "free",
  createdAt: readDate(data.createdAt),
});

/** Calls back now and on every change; null while the document doesn't exist yet. Returns the unsubscribe function. */
export const subscribeToUserProfile = (
  uid: string,
  onChange: (profile: UserProfile | null) => void,
  onError: (error: FirestoreError) => void,
) =>
  onSnapshot(
    firestoreRefs.user(uid),
    snapshot => onChange(snapshot.exists() ? toProfile(snapshot.data({ serverTimestamps: "estimate" })) : null),
    onError,
  );

const createIfMissing = async ({ uid, name, email }: AuthUser) => {
  const ref = firestoreRefs.user(uid);
  if ((await getDoc(ref)).exists()) return;
  await setDoc(ref, { displayName: name, email, plan: "free", createdAt: serverTimestamp() });
};

/** One check per account per session, shared by everyone who asks, so two callers never race to create it. */
const ensured = new Map<string, Promise<void>>();

/**
 * Creates users/{uid} on the free plan the first time an account signs in. Safe to call on every sign-in:
 * an existing document is left alone. A failed attempt is forgotten so the next call retries.
 */
export const ensureUserProfile = (user: AuthUser): Promise<void> => {
  let pending = ensured.get(user.uid);
  if (!pending) {
    pending = createIfMissing(user).catch(error => {
      ensured.delete(user.uid);
      throw error;
    });
    ensured.set(user.uid, pending);
  }
  return pending;
};

/** Writes the account's display name, creating the document first if the account is brand new. */
export const saveDisplayName = async (user: AuthUser) => {
  await ensureUserProfile(user);
  await updateDoc(firestoreRefs.user(user.uid), { displayName: user.name });
};
