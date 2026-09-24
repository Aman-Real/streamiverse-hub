import { CATALOG_CONFIG } from "@/config/catalog.config";
import { TMDB_CONFIG } from "@/config/tmdb.config";
import {
  mapMovieDetail,
  mapMultiResults,
  mapSummaries,
  mapTvDetail,
  type GenreMap,
} from "@/features/catalog/api/tmdb.mappers";
import type {
  TmdbAppendedSeasons,
  TmdbGenreList,
  TmdbMovieDetail,
  TmdbMultiResult,
  TmdbPage,
  TmdbSummary,
  TmdbTvDetail,
} from "@/features/catalog/api/tmdb.types";
import type { TitleDetails, Video, VideoType } from "@/features/catalog/types";
import { parseTitleId, tmdbMediaType } from "@/features/catalog/utils/titleId";
import { TmdbError, tmdbFetch, type TmdbParams } from "@/lib/tmdb";
import { isPresent } from "@/lib/utils";

/*
 * Every catalog request goes through this file, and every response leaves it as app types.
 * Components don't call it directly: they use the cached hooks in hooks/useCatalogQueries.ts.
 */

/** TMDB accepts at most 20 sub-requests in one append_to_response. */
const APPEND_LIMIT = 20;

/** GET with the app's language on every request, so titles and genre names never mix languages. */
const get = <T>(path: string, params: TmdbParams = {}, signal?: AbortSignal) =>
  tmdbFetch<T>(path, { params: { language: TMDB_CONFIG.language, ...params }, signal });

let genreMap: Promise<GenreMap> | null = null;

/**
 * Genre names by id (list results only carry ids). Loaded once per session and shared by every request;
 * a failed load is forgotten so the next request retries. Movie and series lists never reuse an id for
 * different genres, so one map serves both.
 */
const loadGenres = (): Promise<GenreMap> => {
  if (!genreMap) {
    genreMap = Promise.all([get<TmdbGenreList>("/genre/movie/list"), get<TmdbGenreList>("/genre/tv/list")])
      .then(lists => new Map(lists.flatMap(list => list.genres.map(genre => [genre.id, genre.name] as const))))
      .catch(error => {
        genreMap = null;
        throw error;
      });
  }
  return genreMap;
};

/** One page from a movie-only or series-only list endpoint. */
const fetchSummaries = async (path: string, params: TmdbParams, signal?: AbortSignal): Promise<Video[]> => {
  const [genres, page] = await Promise.all([loadGenres(), get<TmdbPage<TmdbSummary>>(path, params, signal)]);
  return mapSummaries(page.results, genres);
};

/** One page from an endpoint that mixes movies, series and people. */
const fetchMixed = async (path: string, params: TmdbParams, signal?: AbortSignal): Promise<Video[]> => {
  const [genres, page] = await Promise.all([loadGenres(), get<TmdbPage<TmdbMultiResult>>(path, params, signal)]);
  return mapMultiResults(page.results, genres);
};

/** This week's most-watched movies and series. */
export const fetchTrending = (signal?: AbortSignal) => fetchMixed("/trending/all/week", {}, signal);

export const fetchTopRatedSeries = (signal?: AbortSignal) => fetchSummaries("/tv/top_rated", {}, signal);

/** The most popular titles of one type in one genre. */
export const fetchGenreRow = (type: VideoType, genreId: number, signal?: AbortSignal) =>
  fetchSummaries(
    `/discover/${tmdbMediaType(type)}`,
    {
      with_genres: genreId,
      sort_by: "popularity.desc",
      "vote_count.gte": CATALOG_CONFIG.minVoteCount,
      include_adult: false,
    },
    signal,
  );

export const searchTitles = (query: string, type: VideoType | "all", signal?: AbortSignal) => {
  const params = { query, include_adult: false };
  return type === "all"
    ? fetchMixed("/search/multi", params, signal)
    : fetchSummaries(`/search/${tmdbMediaType(type)}`, params, signal);
};

/** Every regular season's episodes, loaded APPEND_LIMIT seasons per request. */
const fetchSeasons = async (tmdbId: number, seasonNumbers: number[], signal?: AbortSignal) => {
  const chunks: number[][] = [];
  for (let start = 0; start < seasonNumbers.length; start += APPEND_LIMIT) {
    chunks.push(seasonNumbers.slice(start, start + APPEND_LIMIT));
  }
  const responses = await Promise.all(
    chunks.map(chunk =>
      get<TmdbAppendedSeasons>(`/tv/${tmdbId}`, { append_to_response: chunk.map(season => `season/${season}`).join(",") }, signal),
    ),
  );
  return responses.flatMap((response, index) => chunks[index].map(season => response[`season/${season}`])).filter(isPresent);
};

/** Full details for one title id, plus TMDB's recommendations. Unknown or malformed ids throw a 404 TmdbError. */
export const fetchTitle = async (id: string, signal?: AbortSignal): Promise<TitleDetails> => {
  const parsed = parseTitleId(id);
  if (!parsed) throw new TmdbError(404, `"${id}" isn't a title id.`);

  if (parsed.type === "movie") {
    const [genres, detail] = await Promise.all([
      loadGenres(),
      get<TmdbMovieDetail>(`/movie/${parsed.tmdbId}`, { append_to_response: "credits,release_dates,recommendations" }, signal),
    ]);
    return mapMovieDetail(detail, genres);
  }

  const [genres, detail] = await Promise.all([
    loadGenres(),
    get<TmdbTvDetail>(`/tv/${parsed.tmdbId}`, { append_to_response: "credits,content_ratings,recommendations" }, signal),
  ]);
  const seasonNumbers = detail.seasons.map(season => season.season_number).filter(season => season > 0);
  const seasons = await fetchSeasons(parsed.tmdbId, seasonNumbers, signal);
  return mapTvDetail(detail, seasons, genres);
};
