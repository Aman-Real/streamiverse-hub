import { useContext } from "react";
import { VideoLibraryContext } from "@/features/catalog/context/VideoLibraryContext";

export const useVideoLibrary = () => {
  const context = useContext(VideoLibraryContext);
  if (!context) {
    throw new Error("useVideoLibrary must be used inside <VideoLibraryProvider>");
  }
  return context;
};
