/*
 * Raw TMDB v3 response shapes: only the fields the mappers read.
 * Nothing outside features/catalog/api should import these; the rest of the app sees Video.
 */

export interface TmdbPage<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface TmdbTitleFields {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TmdbMovieSummary extends TmdbTitleFields {
  title: string;
  release_date?: string;
  genre_ids: number[];
}

export interface TmdbTvSummary extends TmdbTitleFields {
  name: string;
  first_air_date?: string;
  genre_ids: number[];
}

/** A movie or series from any list endpoint. Movies have `title`, series have `name`. */
export type TmdbSummary = TmdbMovieSummary | TmdbTvSummary;

/** /trending/all and /search/multi mix movies, series and people. */
export type TmdbMultiResult =
  | (TmdbMovieSummary & { media_type: "movie" })
  | (TmdbTvSummary & { media_type: "tv" })
  | { media_type: "person"; id: number };

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbGenreList {
  genres: TmdbGenre[];
}

export interface TmdbCredits {
  cast: { id: number; name: string; character: string; order: number }[];
  crew: { id: number; name: string; job: string }[];
}

/** Trailers, teasers and clips attached to a title. */
export interface TmdbVideos {
  results: { key: string; site: string; type: string; official?: boolean }[];
}

interface TmdbDetailFields {
  genres: TmdbGenre[];
  tagline: string;
  credits: TmdbCredits;
  /** Present when requested with append_to_response=videos. */
  videos?: TmdbVideos;
}

/** /movie/{id} with append_to_response=credits,release_dates,recommendations,videos. */
export interface TmdbMovieDetail extends Omit<TmdbMovieSummary, "genre_ids">, TmdbDetailFields {
  runtime: number | null;
  release_dates: {
    results: { iso_3166_1: string; release_dates: { certification: string; type: number }[] }[];
  };
  recommendations: TmdbPage<TmdbMovieSummary>;
}

/** /tv/{id} with append_to_response=credits,content_ratings,recommendations,videos. */
export interface TmdbTvDetail extends Omit<TmdbTvSummary, "genre_ids">, TmdbDetailFields {
  episode_run_time: number[];
  number_of_seasons: number;
  seasons: { season_number: number; episode_count: number }[];
  created_by: { id: number; name: string }[];
  content_ratings: { results: { iso_3166_1: string; rating: string }[] };
  recommendations: TmdbPage<TmdbTvSummary>;
}

export interface TmdbEpisode {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_number: number;
  runtime: number | null;
  air_date: string | null;
  still_path: string | null;
}

export interface TmdbSeason {
  season_number: number;
  episodes: TmdbEpisode[];
}

/** /tv/{id} with append_to_response=season/1,season/2,... puts each season under its own key. */
export type TmdbAppendedSeasons = Partial<Record<`season/${number}`, TmdbSeason>>;
