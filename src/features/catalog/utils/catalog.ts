import { TRENDING_IDS } from "@/features/catalog/data/videos.mock";
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

export const getContinueWatching = (videos: Video[]): Video[] =>
  videos.filter(video => video.progress > 0);

export const groupByGenre = (videos: Video[]): VideoCategory[] => {
  const genres = [...new Set(videos.map(video => video.genre))];
  return genres.map(genre => ({
    name: genre,
    items: videos.filter(video => video.genre === genre),
  }));
};

/** Videos in `ids` order; unknown ids are skipped. */
export const pickByIds = (videos: Video[], ids: string[]): Video[] => {
  const byId = new Map(videos.map(video => [video.id, video]));
  return ids.map(id => byId.get(id)).filter((video): video is Video => Boolean(video));
};

/** "recent" expects `videos` in the order they were added. */
export const sortVideos = (videos: Video[], key: SortKey): Video[] =>
  key === "recent"
    ? [...videos].reverse()
    : [...videos].sort((a, b) => (key === "rating" ? b.score - a.score : a.title.localeCompare(b.title)));

/** Home page rows. `trendingIds` is injectable so tests don't depend on the mock data. */
export const buildHomeRows = (videos: Video[], trendingIds: string[] = TRENDING_IDS) => ({
  continueWatching: getContinueWatching(videos),
  trending: pickByIds(videos, trendingIds),
  topRatedSeries: sortVideos(filterByType(videos, "series"), "rating"),
});

export const getRecommendations = (videos: Video[], video: Video): Video[] =>
  videos.filter(item => item.id !== video.id).sort((a, b) => b.match - a.match);

/** 134 -> "2h 14m". */
export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
};

/** Runtime for movies, season count for series. */
export const formatLength = (video: Video): string => {
  if (video.type === "movie") return formatRuntime(video.runtime);
  const seasons = new Set(video.episodes?.map(episode => episode.season)).size || 1;
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
