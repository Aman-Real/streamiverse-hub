import { createContext } from "react";
import type { Video } from "@/features/catalog/types";

export interface MyListContextValue {
  myList: Video[];
  addToList: (video: Video) => void;
  removeFromList: (id: string) => void;
  isInList: (id: string) => boolean;
  toggleList: (video: Video) => void;
}

export const MyListContext = createContext<MyListContextValue | null>(null);
