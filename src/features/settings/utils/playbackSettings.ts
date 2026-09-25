import { PLAYBACK_CONFIG } from "@/config/playback.config";
import type { PlaybackSettings } from "@/features/settings/types";

/** Pure helpers for playback settings. No React, no storage - trivially unit-testable. */

/** Stored settings, type-checked field by field; anything missing or malformed gets the default. */
export const readPlaybackSettings = (stored: unknown): PlaybackSettings => {
  const value = typeof stored === "object" && stored !== null ? (stored as Record<string, unknown>) : {};
  const defaults = PLAYBACK_CONFIG.defaultSettings;
  return {
    autoplayNext: typeof value.autoplayNext === "boolean" ? value.autoplayNext : defaults.autoplayNext,
    hdStreaming: typeof value.hdStreaming === "boolean" ? value.hdStreaming : defaults.hdStreaming,
  };
};

/** Stream quality in lines for the HD Streaming setting: 1080 when on, 720 when off. */
export const streamQuality = ({ hdStreaming }: Pick<PlaybackSettings, "hdStreaming">): number =>
  hdStreaming ? PLAYBACK_CONFIG.quality.hd : PLAYBACK_CONFIG.quality.standard;
