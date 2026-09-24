import { useContext } from "react";
import { WatchProgressContext } from "@/features/watch-progress/context/WatchProgressContext";

export const useWatchProgress = () => {
  const context = useContext(WatchProgressContext);
  if (!context) {
    throw new Error("useWatchProgress must be used inside <WatchProgressProvider>");
  }
  return context;
};
