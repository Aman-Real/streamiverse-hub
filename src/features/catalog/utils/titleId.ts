import type { VideoType } from "@/features/catalog/types";

/** TMDB's name for each video type; also the prefix of every title id. */
export type TmdbMediaType = "movie" | "tv";

const MEDIA_TYPES: Record<VideoType, TmdbMediaType> = { movie: "movie", series: "tv" };

export const tmdbMediaType = (type: VideoType): TmdbMediaType => MEDIA_TYPES[type];

/** App-wide title id. TMDB numbers movies and series separately, so the type is part of it: "movie-603", "tv-1399". */
export const toTitleId = (type: VideoType, tmdbId: number) => `${MEDIA_TYPES[type]}-${tmdbId}`;

/** A title id split back into its type and TMDB id; null for anything malformed, such as a hand-edited URL. */
export const parseTitleId = (id: string): { type: VideoType; tmdbId: number } | null => {
  const match = /^(movie|tv)-(\d+)$/.exec(id);
  if (!match) return null;
  return { type: match[1] === "tv" ? "series" : "movie", tmdbId: Number(match[2]) };
};

/** Episode ids are unique across the whole catalog: "tv-1399-s2e5". */
export const toEpisodeId = (titleId: string, season: number, episode: number) => `${titleId}-s${season}e${episode}`;
