import { FirebaseError } from "firebase/app";
import { ImageProcessingError } from "@/lib/image";

/** A message for a failed profile save that says what to do next. */
export const getProfileSaveErrorMessage = (error: unknown): string => {
  if (error instanceof ImageProcessingError) return error.message;
  if (error instanceof FirebaseError) {
    if (error.code === "permission-denied") {
      return import.meta.env.DEV
        ? "Firestore rules blocked the save. Allow displayName and photoUrl updates on users/{uid} in firestore.rules."
        : "You don't have permission to change this. Sign out, sign back in and try again.";
    }
    if (error.code === "unavailable") return "Can't reach the server. Check your connection and try again.";
  }
  return "Couldn't save your changes. Try again.";
};
