import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PLAYBACK_CONFIG } from "@/config/playback.config";
import * as authApi from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Video } from "@/features/catalog/types";
import type { PlaybackPosition } from "@/features/player/types";
import * as progressApi from "@/features/watch-progress/api/progress.api";
import {
  WatchProgressContext,
  type SaveProgressOptions,
  type WatchProgressContextValue,
} from "@/features/watch-progress/context/WatchProgressContext";
import type { ProgressEntry, ProgressUpdate } from "@/features/watch-progress/types";
import {
  applyProgress,
  isInProgress,
  toProgressUpdate,
  toWatchedVideo,
} from "@/features/watch-progress/utils/progress";

const NO_ENTRIES: ProgressEntry[] = [];

/** Entries tagged with the account they belong to, so a sign-out never shows the previous account's data. */
interface LoadedProgress {
  uid: string;
  entries: ProgressEntry[];
}

interface PendingSave {
  uid: string;
  update: ProgressUpdate;
}

const reportWriteError = (error: unknown) => {
  console.error("[Progress] Write failed:", error);
  toast.error("Couldn't update your watch history. Check your connection and try again.");
};

/**
 * Where the signed-in viewer stopped each title, synced live from Firestore (users/{uid}/progress).
 * The player reports several times a minute, so saves are throttled to one per title every
 * PLAYBACK_CONFIG.saveIntervalMs, plus an immediate save on pause, on close and when the tab is hidden.
 * Guests can watch, but nothing is saved until they sign in.
 */
export const WatchProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user, status } = useAuth();
  const uid = user?.uid;
  const [loaded, setLoaded] = useState<LoadedProgress | null>(null);
  const pendingRef = useRef(new Map<string, PendingSave>());
  const timersRef = useRef(new Map<string, number>());

  useEffect(() => {
    if (!uid) return;
    return progressApi.subscribeToProgress(
      uid,
      entries => setLoaded({ uid, entries }),
      error => {
        // Signing out ends this listener with a permission error; that's expected, not a failure.
        if (authApi.getCurrentUid() !== uid) return;
        console.error("[Progress] Couldn't load watch progress:", error);
        toast.error("Couldn't load your watch progress.", { id: "progress-load-error" });
        setLoaded({ uid, entries: [] });
      },
    );
  }, [uid]);

  const entries = uid && loaded?.uid === uid ? loaded.entries : NO_ENTRIES;
  const loading = status === "loading" || (Boolean(uid) && loaded?.uid !== uid);
  const entriesById = useMemo(() => new Map(entries.map(entry => [entry.title.id, entry])), [entries]);

  const cancelPending = useCallback((titleId: string) => {
    window.clearTimeout(timersRef.current.get(titleId));
    timersRef.current.delete(titleId);
    pendingRef.current.delete(titleId);
  }, []);

  const flush = useCallback(
    (titleId: string) => {
      const pending = pendingRef.current.get(titleId);
      cancelPending(titleId);
      if (!pending) return;
      progressApi
        .saveProgressEntry(pending.uid, pending.update)
        // Background saves fail quietly: the next one retries, and a toast every 15s would be noise.
        .catch(error => console.error("[Progress] Couldn't save progress:", error));
    },
    [cancelPending],
  );

  // Save anything pending when the tab is hidden or closed; Firestore keeps writes made offline and syncs them later.
  useEffect(() => {
    const flushAll = () => [...pendingRef.current.keys()].forEach(flush);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushAll();
    };
    window.addEventListener("pagehide", flushAll);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", flushAll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      flushAll();
    };
  }, [flush]);

  const saveProgress = useCallback(
    (video: Video, position: PlaybackPosition, { episode, immediate = false }: SaveProgressOptions = {}) => {
      if (!uid) return;
      const update = toProgressUpdate(video, position, episode);
      if (!update) return;
      // Opening a title and leaving before it gets going isn't watching it.
      const known = entriesById.has(video.id) || pendingRef.current.has(video.id);
      if (update.progress === 0 && !known) return;

      pendingRef.current.set(video.id, { uid, update });
      if (immediate) {
        flush(video.id);
      } else if (!timersRef.current.has(video.id)) {
        timersRef.current.set(
          video.id,
          window.setTimeout(() => flush(video.id), PLAYBACK_CONFIG.saveIntervalMs),
        );
      }
    },
    [uid, entriesById, flush],
  );

  const removeProgress = useCallback(
    (titleId: string) => {
      if (!uid) return;
      cancelPending(titleId);
      progressApi.deleteProgressEntry(uid, titleId).catch(reportWriteError);
    },
    [uid, cancelPending],
  );

  const clearWatchHistory = useCallback(() => {
    if (!uid) return;
    [...pendingRef.current.keys()].forEach(cancelPending);
    progressApi.deleteAllProgress(uid).catch(reportWriteError);
  }, [uid, cancelPending]);

  const value = useMemo<WatchProgressContextValue>(() => {
    const history = entries.map(toWatchedVideo);
    return {
      loading,
      continueWatching: history.filter(isInProgress),
      history,
      getProgress: titleId => entriesById.get(titleId),
      withProgress: video => applyProgress(video, entriesById.get(video.id)),
      saveProgress,
      removeProgress,
      clearWatchHistory,
    };
  }, [entries, entriesById, loading, saveProgress, removeProgress, clearWatchHistory]);

  return <WatchProgressContext.Provider value={value}>{children}</WatchProgressContext.Provider>;
};
