import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import * as authApi from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { TitleSnapshot, Video } from "@/features/catalog/types";
import { fromTitleSnapshot, toTitleSnapshot } from "@/features/catalog/utils/titleSnapshot";
import * as myListApi from "@/features/my-list/api/myList.api";
import { MyListContext, type MyListContextValue } from "@/features/my-list/context/MyListContext";

const NO_VIDEOS: Video[] = [];

/** Titles tagged with the account they belong to, so a sign-out never shows the previous account's list. */
interface LoadedList {
  uid: string;
  titles: TitleSnapshot[];
}

const reportWriteError = (error: unknown) => {
  console.error("[My List] Write failed:", error);
  toast.error("Couldn't update My List. Check your connection and try again.");
};

/**
 * The signed-in account's saved titles, synced live from Firestore (users/{uid}/myList), so the list
 * follows the account across devices. Changes show instantly: Firestore applies local writes before the
 * server confirms them. Guests have an empty list; MyListButton asks them to sign in.
 */
export const MyListProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const uid = user?.uid;
  const [loaded, setLoaded] = useState<LoadedList | null>(null);

  useEffect(() => {
    if (!uid) return;
    return myListApi.subscribeToMyList(
      uid,
      titles => setLoaded({ uid, titles }),
      error => {
        // Signing out ends this listener with a permission error; that's expected, not a failure.
        if (authApi.getCurrentUid() !== uid) return;
        console.error("[My List] Couldn't load My List:", error);
        toast.error("Couldn't load My List.", { id: "my-list-load-error" });
        setLoaded({ uid, titles: [] });
      },
    );
  }, [uid]);

  const myList = useMemo(
    () => (uid && loaded?.uid === uid ? loaded.titles.map(fromTitleSnapshot) : NO_VIDEOS),
    [uid, loaded],
  );
  const savedIds = useMemo(() => new Set(myList.map(video => video.id)), [myList]);

  const addToList = useCallback(
    (video: Video) => {
      if (!uid || savedIds.has(video.id)) return;
      myListApi.addToMyList(uid, toTitleSnapshot(video)).catch(reportWriteError);
    },
    [uid, savedIds],
  );

  const removeFromList = useCallback(
    (id: string) => {
      if (!uid) return;
      myListApi.removeFromMyList(uid, id).catch(reportWriteError);
    },
    [uid],
  );

  const isInList = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggleList = useCallback(
    (video: Video) => {
      if (savedIds.has(video.id)) {
        removeFromList(video.id);
      } else {
        addToList(video);
      }
    },
    [savedIds, addToList, removeFromList],
  );

  const value = useMemo<MyListContextValue>(
    () => ({ myList, addToList, removeFromList, isInList, toggleList }),
    [myList, addToList, removeFromList, isInList, toggleList],
  );

  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>;
};
