import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Video } from "@/lib/videoData";

interface MyListContextType {
  myList: Video[];
  addToList: (video: Video) => void;
  removeFromList: (id: string) => void;
  isInList: (id: string) => boolean;
  toggleList: (video: Video) => void;
}

const MyListContext = createContext<MyListContextType | null>(null);

export const MyListProvider = ({ children }: { children: ReactNode }) => {
  const [myList, setMyList] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem("streamix-mylist");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const persist = (list: Video[]) => {
    setMyList(list);
    localStorage.setItem("streamix-mylist", JSON.stringify(list));
  };

  const addToList = useCallback((video: Video) => {
    setMyList(prev => {
      if (prev.find(v => v.id === video.id)) return prev;
      const next = [...prev, video];
      localStorage.setItem("streamix-mylist", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromList = useCallback((id: string) => {
    setMyList(prev => {
      const next = prev.filter(v => v.id !== id);
      localStorage.setItem("streamix-mylist", JSON.stringify(next));
      return next;
    });
  }, []);

  const isInList = useCallback((id: string) => myList.some(v => v.id === id), [myList]);

  const toggleList = useCallback((video: Video) => {
    if (myList.find(v => v.id === video.id)) {
      removeFromList(video.id);
    } else {
      addToList(video);
    }
  }, [myList, addToList, removeFromList]);

  return (
    <MyListContext.Provider value={{ myList, addToList, removeFromList, isInList, toggleList }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const ctx = useContext(MyListContext);
  if (!ctx) throw new Error("useMyList must be used within MyListProvider");
  return ctx;
};
