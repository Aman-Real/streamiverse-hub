import { createContext } from "react";
import type { Video } from "@/features/catalog/types";

export interface VideoLibraryContextValue {
  videos: Video[];
  /** Record watch progress as a 0-100 percentage. */
  updateProgress: (id: string, progress: number) => void;
  /** Reset progress on every video. */
  clearWatchHistory: () => void;
}

export const VideoLibraryContext = createContext<VideoLibraryContextValue | null>(null);
