import {
  deleteDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  type FirestoreError,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { PLAYBACK_CONFIG } from "@/config/playback.config";
import { readTitleSnapshot } from "@/features/catalog/utils/titleSnapshot";
import type { ProgressEntry, ProgressUpdate } from "@/features/watch-progress/types";
import { db } from "@/lib/firebase";
import { readDate, readNumber, readOptionalNumber, readOptionalString } from "@/lib/firestoreData";
import { firestoreRefs } from "@/lib/firestoreRefs";
import { isPresent } from "@/lib/utils";

/*
 * Every watch-progress read and write goes through this file.
 * Documents live at users/{uid}/progress/{titleId}; firestore.rules keeps each account to its own.
 */

/** Firestore caps a batch at 500 writes. */
const BATCH_LIMIT = 500;

const toEntry = (snapshot: QueryDocumentSnapshot): ProgressEntry | null => {
  const data = snapshot.data({ serverTimestamps: "estimate" });
  const title = readTitleSnapshot(data.title);
  if (!title) return null;
  return {
    title,
    progress: Math.min(100, Math.max(0, readNumber(data.progress))),
    positionSeconds: readNumber(data.positionSeconds),
    durationSeconds: readNumber(data.durationSeconds),
    season: readOptionalNumber(data.season),
    episode: readOptionalNumber(data.episode),
    episodeTitle: readOptionalString(data.episodeTitle),
    updatedAt: readDate(data.updatedAt),
  };
};

/**
 * Calls back now with the most recently watched entries, then on every change, including this device's
 * own writes before they reach the server. Returns the unsubscribe function.
 */
export const subscribeToProgress = (
  uid: string,
  onChange: (entries: ProgressEntry[]) => void,
  onError: (error: FirestoreError) => void,
) =>
  onSnapshot(
    query(firestoreRefs.progress(uid), orderBy("updatedAt", "desc"), limit(PLAYBACK_CONFIG.historyLimit)),
    snapshot => onChange(snapshot.docs.map(toEntry).filter(isPresent)),
    onError,
  );

export const saveProgressEntry = (uid: string, update: ProgressUpdate) =>
  setDoc(firestoreRefs.progressEntry(uid, update.title.id), { ...update, updatedAt: serverTimestamp() });

export const deleteProgressEntry = (uid: string, titleId: string) => deleteDoc(firestoreRefs.progressEntry(uid, titleId));

/** Deletes every entry, not just the loaded ones. */
export const deleteAllProgress = async (uid: string) => {
  const { docs } = await getDocs(firestoreRefs.progress(uid));
  for (let start = 0; start < docs.length; start += BATCH_LIMIT) {
    const batch = writeBatch(db);
    docs.slice(start, start + BATCH_LIMIT).forEach(entry => batch.delete(entry.ref));
    await batch.commit();
  }
};
