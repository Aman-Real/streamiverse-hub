import type { EpisodeRef } from "@/app/routes";
import type { GenreOption } from "@/config/catalog.config";
import type { Episode, Video, VideoCategory, VideoType } from "@/features/catalog/types";

/** Pure functions over a video list. No React, no state - trivially unit-testable. */

export type SortKey = "recent" | "rating" | "title";

export const searchVideos = (videos: Video[], query: string): Video[] => {
  const q = query.trim().toLowerCase();
  if (!q) return videos;
  return videos.filter(
    video => video.title.toLowerCase().includes(q) || video.genre.toLowerCase().includes(q),
  );
};

export const filterByType = (videos: Video[], type: VideoType | "all"): Video[] =>
  type === "all" ? videos : videos.filter(video => video.type === type);

export const groupByGenre = (videos: Video[]): VideoCategory[] => {
  const genres = [...new Set(videos.map(video => video.genre))];
  return genres.map(genre => ({
    name: genre,
    items: videos.filter(video => video.genre === genre),
  }));
};

/** "recent" expects `videos` in the order they were added. */
export const sortVideos = (videos: Video[], key: SortKey): Video[] =>
  key === "recent"
    ? [...videos].reverse()
    : [...videos].sort((a, b) => (key === "rating" ? b.score - a.score : a.title.localeCompare(b.title)));

/** 134 -> "2h 14m". */
export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
};

/** Runtime for movies, season count for series. List results carry neither, so those show the type instead. */
export const formatLength = (video: Video): string => {
  if (video.type === "movie") return video.runtime > 0 ? formatRuntime(video.runtime) : "Movie";
  const seasons = video.seasonCount ?? new Set(video.episodes?.map(episode => episode.season)).size;
  if (!seasons) return "Series";
  return `${seasons} Season${seasons > 1 ? "s" : ""}`;
};

export const timeLeft = ({ runtime, progress }: Pick<Episode, "runtime" | "progress">): string =>
  `${formatRuntime(Math.round((runtime * (100 - progress)) / 100))} left`;

/** The episode to resume: the first one in progress, else the first episode. */
export const currentEpisode = (video: Video): Episode | undefined =>
  video.episodes?.find(episode => episode.progress > 0 && episode.progress < 100) ?? video.episodes?.[0];

/** Continue-watching subtitle, e.g. "S2:E1 • 22m left" or "54m left • 4K HDR". */
export const getResumeLabel = (video: Video): string => {
  const episode = currentEpisode(video);
  return episode
    ? `S${episode.season}:E${episode.number} • ${timeLeft(video)}`
    : [timeLeft(video), ...video.formats.slice(0, 1)].join(" • ");
};

/**
 * The episode after `current` in airing order (the next one in the season, else the first of the next
 * season); undefined after the last aired episode. Works even if `current` itself is no longer listed.
 */
export const getNextEpisode = (video: Video, current: EpisodeRef): Episode | undefined =>
  video.episodes?.find(
    episode => episode.season > current.season || (episode.season === current.season && episode.number > current.episode),
  );

/** Merges lists by taking one item from each in turn: [a1, b1, a2, b2, ...]. Duplicate ids keep their first place. */
export const interleave = (lists: Video[][]): Video[] => {
  const seen = new Set<string>();
  const merged: Video[] = [];
  const longest = Math.max(0, ...lists.map(list => list.length));
  for (let index = 0; index < longest; index += 1) {
    for (const list of lists) {
      const video = list[index];
      if (video && !seen.has(video.id)) {
        seen.add(video.id);
        merged.push(video);
      }
    }
  }
  return merged;
};

/** Rows with every title that an earlier row already shows removed; rows left empty are dropped. */
export const dedupeCategories = (categories: VideoCategory[]): VideoCategory[] => {
  const shown = new Set<string>();
  return categories
    .map(category => {
      const items = category.items.filter(video => !shown.has(video.id));
      items.forEach(video => shown.add(video.id));
      return { ...category, items };
    })
    .filter(category => category.items.length > 0);
};

/** The genre choice a TMDB genre name belongs to, e.g. "Action & Adventure" -> Action. */
export const findGenreOption = (options: readonly GenreOption[], genreName: string): GenreOption | undefined =>
  options.find(option => option.label === genreName || option.aliases?.includes(genreName));

/** The genre choice that appears most often across `videos` (e.g. the viewer's history); undefined when none match. */
export const favouriteGenreOption = (options: readonly GenreOption[], videos: Video[]): GenreOption | undefined => {
  const counts = new Map<string, number>();
  for (const video of videos) {
    const option = findGenreOption(options, video.genre);
    if (option) counts.set(option.id, (counts.get(option.id) ?? 0) + 1);
  }
  let best: GenreOption | undefined;
  for (const option of options) {
    if ((counts.get(option.id) ?? 0) > (best ? counts.get(best.id) ?? 0 : 0)) best = option;
  }
  return best;
};
