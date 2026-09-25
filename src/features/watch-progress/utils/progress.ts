import type { EpisodeRef } from "@/app/routes";
import { PLAYBACK_CONFIG } from "@/config/playback.config";
import type { Episode, Video } from "@/features/catalog/types";
import { getNextEpisode } from "@/features/catalog/utils/catalog";
import { toEpisodeId } from "@/features/catalog/utils/titleId";
import { fromTitleSnapshot, toTitleSnapshot } from "@/features/catalog/utils/titleSnapshot";
import type { PlaybackPosition } from "@/features/player/types";
import type { ProgressEntry, ProgressUpdate } from "@/features/watch-progress/types";

/** Pure functions over watch progress. No React, no Firestore - trivially unit-testable. */

/** A player report -> the document to save; null while the stream's length is still unknown. */
export const toProgressUpdate = (
  video: Video,
  { positionSeconds, durationSeconds }: PlaybackPosition,
  episode?: Episode,
): ProgressUpdate | null => {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return null;
  const percent = Math.min(100, Math.max(0, Math.round((positionSeconds / durationSeconds) * 100)));
  return {
    title: toTitleSnapshot(video),
    progress: percent >= PLAYBACK_CONFIG.completedAtPercent ? 100 : percent,
    positionSeconds: Math.max(0, Math.floor(positionSeconds)),
    durationSeconds: Math.round(durationSeconds),
    season: episode?.season ?? null,
    episode: episode?.number ?? null,
    episodeTitle: episode?.title ?? null,
  };
};

/** `video` with the viewer's progress on it: the title-level bar, and the matching episode's for series. */
export const applyProgress = (video: Video, entry: ProgressEntry | undefined): Video => {
  if (!entry) return video;
  return {
    ...video,
    progress: entry.progress,
    episodes: video.episodes?.map(episode =>
      episode.season === entry.season && episode.number === entry.episode ? { ...episode, progress: entry.progress } : episode,
    ),
  };
};

/**
 * A progress entry as a card-ready Video. Runtime comes from the stream actually played, so
 * "22m left" is true to it. For series, only the episode being watched is known, which is all
 * the "S2:E5 • 22m left" label needs.
 */
export const toWatchedVideo = (entry: ProgressEntry): Video => {
  const video = fromTitleSnapshot(entry.title);
  const runtime = entry.durationSeconds > 0 ? Math.max(1, Math.round(entry.durationSeconds / 60)) : video.runtime;
  const { season, episode } = entry;
  return {
    ...video,
    runtime,
    progress: entry.progress,
    episodes:
      season !== null && episode !== null
        ? [
            {
              id: toEpisodeId(video.id, season, episode),
              season,
              number: episode,
              title: entry.episodeTitle ?? `Episode ${episode}`,
              description: "",
              runtime,
              airDate: "",
              format: PLAYBACK_CONFIG.format,
              progress: entry.progress,
              thumbnail: video.backdrop ?? video.thumbnail,
            },
          ]
        : undefined,
  };
};

/** Started but not finished: what Continue Watching shows. */
export const isInProgress = (video: Video) => video.progress > 0 && video.progress < 100;

/**
 * The episode to play: the one in the URL, else the one the viewer was watching (or, if they finished it,
 * the one after it), else the first.
 */
export const resolveEpisode = (
  video: Video,
  requested: EpisodeRef | null,
  entry: ProgressEntry | undefined,
): Episode | undefined => {
  const episodes = video.episodes ?? [];
  const find = (season: number | null, number: number | null) =>
    episodes.find(episode => episode.season === season && episode.number === number);
  const fromHistory = () => {
    if (!entry || entry.season === null || entry.episode === null) return undefined;
    const last = find(entry.season, entry.episode);
    if (entry.progress < 100) return last;
    return getNextEpisode(video, { season: entry.season, episode: entry.episode }) ?? last;
  };
  return (requested ? find(requested.season, requested.episode) : undefined) ?? fromHistory() ?? episodes[0];
};

/** Seconds to resume from: where the viewer stopped this movie or episode, or 0 if finished or not started. */
export const resumePosition = (entry: ProgressEntry | undefined, episode: Episode | undefined): number => {
  if (!entry || entry.progress >= 100) return 0;
  const sameItem = episode
    ? entry.season === episode.season && entry.episode === episode.number
    : entry.season === null;
  return sameItem ? entry.positionSeconds : 0;
};

/** What the Watch Room button does for this viewer, decided from their most recent progress entry. */
export type WatchRoomPlan =
  /** Nothing watched yet: suggest the latest movies, web series, anime and TV shows. */
  | { kind: "discover" }
  /** Finished a series episode; the title's episode list is needed to find the next one. */
  | { kind: "loading" }
  /** Resume the unfinished movie or episode, or start the next episode. */
  | { kind: "play"; titleId: string; episode?: EpisodeRef }
  /** Finished a movie, or the last episode of a series: suggest related titles. */
  | { kind: "finished"; titleId: string };

/**
 * The Watch Room decision. `latest` is the most recently watched entry; `title` is its full details
 * (only needed once a series episode is finished). `titleFailed` means the details couldn't be loaded.
 */
export const planWatchRoom = (
  latest: ProgressEntry | undefined,
  title: Video | undefined,
  titleFailed = false,
): WatchRoomPlan => {
  if (!latest) return { kind: "discover" };
  const titleId = latest.title.id;
  if (latest.progress < 100) return { kind: "play", titleId };

  const { season, episode } = latest;
  if (latest.title.type === "movie" || season === null || episode === null) return { kind: "finished", titleId };
  if (!title) return titleFailed ? { kind: "finished", titleId } : { kind: "loading" };

  const next = getNextEpisode(title, { season, episode });
  return next ? { kind: "play", titleId, episode: { season: next.season, episode: next.number } } : { kind: "finished", titleId };
};
