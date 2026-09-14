import { CURATED_ROWS, type CuratedRow } from "@/features/catalog/data/videos.mock";
import type { Video, VideoCategory, VideoType } from "@/features/catalog/types";

/** Pure functions over a video list. No React, no state - trivially unit-testable. */

export const searchVideos = (videos: Video[], query: string): Video[] => {
  const q = query.trim().toLowerCase();
  if (!q) return videos;
  return videos.filter(
    video => video.title.toLowerCase().includes(q) || video.genre.toLowerCase().includes(q),
  );
};

export const filterByType = (videos: Video[], type: VideoType): Video[] =>
  videos.filter(video => video.type === type);

export const getContinueWatching = (videos: Video[]): Video[] =>
  videos.filter(video => video.progress > 0);

export const groupByGenre = (videos: Video[]): VideoCategory[] => {
  const genres = [...new Set(videos.map(video => video.genre))];
  return genres.map(genre => ({
    name: genre,
    items: videos.filter(video => video.genre === genre),
  }));
};

/**
 * Rows for the home page: live "Continue Watching" first, then curated rows.
 * `rows` is injectable so tests don't depend on the mock data.
 */
export const buildHomeCategories = (
  videos: Video[],
  rows: CuratedRow[] = CURATED_ROWS,
): VideoCategory[] => {
  const byId = new Map(videos.map(video => [video.id, video]));

  const curated = rows.map(row => ({
    name: row.name,
    items: row.videoIds
      .map(id => byId.get(id))
      .filter((video): video is Video => Boolean(video)),
  }));

  return [{ name: "Continue Watching", items: getContinueWatching(videos) }, ...curated];
};
