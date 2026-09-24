import { collection, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Every Firestore location the app reads or writes. firestore.rules opens exactly these paths,
 * so keep the two in step when adding one.
 */
export const firestoreRefs = {
  /** users/{uid}: profile and plan. */
  user: (uid: string) => doc(db, "users", uid),
  /** users/{uid}/progress/{titleId}: where the viewer stopped each title. */
  progress: (uid: string) => collection(db, "users", uid, "progress"),
  progressEntry: (uid: string, titleId: string) => doc(db, "users", uid, "progress", titleId),
  /** users/{uid}/myList/{titleId}: saved titles. */
  myList: (uid: string) => collection(db, "users", uid, "myList"),
  myListEntry: (uid: string, titleId: string) => doc(db, "users", uid, "myList", titleId),
};
