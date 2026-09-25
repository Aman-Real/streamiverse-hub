import { createContext } from "react";
import type { PlaybackSettings } from "@/features/settings/types";

export interface PlaybackSettingsContextValue extends PlaybackSettings {
  /** Stream quality in lines: 1080 with HD streaming on, 720 with it off. */
  quality: number;
  setAutoplayNext: (enabled: boolean) => void;
  setHdStreaming: (enabled: boolean) => void;
}

export const PlaybackSettingsContext = createContext<PlaybackSettingsContextValue | null>(null);
