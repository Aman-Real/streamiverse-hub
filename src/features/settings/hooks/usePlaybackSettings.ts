import { useContext } from "react";
import { PlaybackSettingsContext } from "@/features/settings/context/PlaybackSettingsContext";

export const usePlaybackSettings = () => {
  const context = useContext(PlaybackSettingsContext);
  if (!context) {
    throw new Error("usePlaybackSettings must be used inside <PlaybackSettingsProvider>");
  }
  return context;
};
