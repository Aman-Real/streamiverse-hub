import {
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type FirestoreError,
} from "firebase/firestore";
import type { TitleSnapshot } from "@/features/catalog/types";
import { readTitleSnapshot } from "@/features/catalog/utils/titleSnapshot";
import { firestoreRefs } from "@/lib/firestoreRefs";
import { isPresent } from "@/lib/utils";

/*
 * Every My List read and write goes through this file.
 * Documents live at users/{uid}/myList/{titleId}; firestore.rules keeps each account to its own.
 */

/**
 * Calls back now with the saved titles, oldest first (the order "Recently Added" reverses), then on
 * every change, including this device's own writes before they reach the server. Returns the unsubscribe function.
 */
export const subscribeToMyList = (
  uid: string,
  onChange: (titles: TitleSnapshot[]) => void,
  onError: (error: FirestoreError) => void,
) =>
  onSnapshot(
    query(firestoreRefs.myList(uid), orderBy("addedAt", "asc")),
    snapshot => onChange(snapshot.docs.map(entry => readTitleSnapshot(entry.data().title)).filter(isPresent)),
    onError,
  );

export const addToMyList = (uid: string, title: TitleSnapshot) =>
  setDoc(firestoreRefs.myListEntry(uid, title.id), { title, addedAt: serverTimestamp() });

export const removeFromMyList = (uid: string, titleId: string) => deleteDoc(firestoreRefs.myListEntry(uid, titleId));
