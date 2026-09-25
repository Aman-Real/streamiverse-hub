import { ReactNode, useCallback, useMemo } from "react";
import { STORAGE_KEYS } from "@/config/storageKeys";
import {
  PlaybackSettingsContext,
  type PlaybackSettingsContextValue,
} from "@/features/settings/context/PlaybackSettingsContext";
import type { PlaybackSettings } from "@/features/settings/types";
import { readPlaybackSettings, streamQuality } from "@/features/settings/utils/playbackSettings";
import { useLocalStorage } from "@/hooks/useLocalStorage";

/**
 * Playback preferences, saved in this browser so they survive reloads and sign-outs.
 * One provider for the whole app, so the Settings screen and the Watch Room always agree.
 */
export const PlaybackSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [stored, setStored] = useLocalStorage<unknown>(STORAGE_KEYS.playbackSettings, null);
  const settings = useMemo(() => readPlaybackSettings(stored), [stored]);

  const update = useCallback(
    (patch: Partial<PlaybackSettings>) => setStored((previous: unknown) => ({ ...readPlaybackSettings(previous), ...patch })),
    [setStored],
  );
  const setAutoplayNext = useCallback((enabled: boolean) => update({ autoplayNext: enabled }), [update]);
  const setHdStreaming = useCallback((enabled: boolean) => update({ hdStreaming: enabled }), [update]);

  const value = useMemo<PlaybackSettingsContextValue>(
    () => ({ ...settings, quality: streamQuality(settings), setAutoplayNext, setHdStreaming }),
    [settings, setAutoplayNext, setHdStreaming],
  );

  return <PlaybackSettingsContext.Provider value={value}>{children}</PlaybackSettingsContext.Provider>;
};
