import { ReactNode, useCallback, useMemo } from "react";
import { STORAGE_KEYS } from "@/config/storageKeys";
import type { Video } from "@/features/catalog/types";
import { MyListContext, type MyListContextValue } from "@/features/my-list/context/MyListContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

/** The user's saved titles. Persists to localStorage via useLocalStorage. */
export const MyListProvider = ({ children }: { children: ReactNode }) => {
  const [myList, setMyList] = useLocalStorage<Video[]>(STORAGE_KEYS.myList, []);

  const addToList = useCallback(
    (video: Video) => {
      setMyList(previous =>
        previous.some(item => item.id === video.id) ? previous : [...previous, video],
      );
    },
    [setMyList],
  );

  const removeFromList = useCallback(
    (id: string) => {
      setMyList(previous => previous.filter(item => item.id !== id));
    },
    [setMyList],
  );

  const isInList = useCallback((id: string) => myList.some(item => item.id === id), [myList]);

  const toggleList = useCallback(
    (video: Video) => {
      if (myList.some(item => item.id === video.id)) {
        removeFromList(video.id);
      } else {
        addToList(video);
      }
    },
    [myList, addToList, removeFromList],
  );

  const value = useMemo<MyListContextValue>(
    () => ({ myList, addToList, removeFromList, isInList, toggleList }),
    [myList, addToList, removeFromList, isInList, toggleList],
  );

  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>;
};
