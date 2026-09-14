import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  VideoLibraryContext,
  type VideoLibraryContextValue,
} from "@/features/catalog/context/VideoLibraryContext";
import { MOCK_VIDEOS } from "@/features/catalog/data/videos.mock";
import type { Video } from "@/features/catalog/types";

/**
 * The one and only copy of the catalog.
 * Every page reads from here, so watch progress stays consistent across routes.
 */
export const VideoLibraryProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);

  const updateProgress = useCallback((id: string, progress: number) => {
    const next = Math.min(100, Math.max(0, Math.round(progress)));
    setVideos(previous =>
      previous.map(video =>
        video.id === id && video.progress !== next ? { ...video, progress: next } : video,
      ),
    );
  }, []);

  const clearWatchHistory = useCallback(() => {
    setVideos(previous =>
      previous.map(video => (video.progress === 0 ? video : { ...video, progress: 0 })),
    );
  }, []);

  const value = useMemo<VideoLibraryContextValue>(
    () => ({ videos, updateProgress, clearWatchHistory }),
    [videos, updateProgress, clearWatchHistory],
  );

  return <VideoLibraryContext.Provider value={value}>{children}</VideoLibraryContext.Provider>;
};
