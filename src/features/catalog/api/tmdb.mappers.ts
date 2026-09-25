import { CATALOG_CONFIG } from "@/config/catalog.config";
import { PLAYBACK_CONFIG } from "@/config/playback.config";
import { TMDB_CONFIG } from "@/config/tmdb.config";
import type {
  TmdbCredits,
  TmdbEpisode,
  TmdbMovieDetail,
  TmdbMultiResult,
  TmdbSeason,
  TmdbSummary,
  TmdbTvDetail,
  TmdbVideos,
} from "@/features/catalog/api/tmdb.types";
import type { CastMember, Episode, TitleDetails, Video } from "@/features/catalog/types";
import { toEpisodeId, toTitleId } from "@/features/catalog/utils/titleId";

/*
 * TMDB responses -> app types. The only code that knows both shapes.
 * Pure functions (no fetching, no React), so they're trivially unit-testable.
 */

/** TMDB genre id -> genre name. */
export type GenreMap = ReadonlyMap<number, string>;

/** Age rating when TMDB has none for the configured region. */
const UNRATED = "NR";
/** Genre shown when TMDB lists none. */
const NO_GENRE = "Other";
/** Transparent pixel for missing artwork, so the card's own background shows instead of a broken image. */
const MISSING_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
/** TMDB genre names too long for card badges. */
const SHORT_GENRE_NAMES: Record<string, string> = { "Science Fiction": "Sci-Fi" };

const { imageSizes } = TMDB_CONFIG;

const imageUrl = (path: string, size: string) => `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;

const genreName = (name: string | undefined) => (name ? SHORT_GENRE_NAMES[name] ?? name : NO_GENRE);

/** "2024-05-01" -> 2024; 0 when TMDB has no date. */
const yearOf = (date: string | null | undefined) => Number(date?.slice(0, 4)) || 0;

/** "2025-10-14" -> "Oct 14, 2025". */
const formatAirDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(TMDB_CONFIG.language, { month: "short", day: "numeric", year: "numeric" });

const releaseDateOf = (item: TmdbSummary) => ("title" in item ? item.release_date : item.first_air_date);

/** Titles worth a card. TMDB also returns stubs with no poster or date, mostly in search. */
const isListable = (item: TmdbSummary) => Boolean(item.poster_path && releaseDateOf(item));

/** Episodes that have aired. TMDB also lists announced ones, which can't be watched yet. */
const hasAired = (episode: TmdbEpisode) =>
  Boolean(episode.air_date) && new Date(`${episode.air_date}T00:00:00`) <= new Date();

/** A movie or series list result -> card-ready Video. Detail mappers add runtime, rating, cast and episodes. */
export const mapSummary = (item: TmdbSummary, genres: GenreMap): Video => {
  const shared = {
    description: item.overview,
    thumbnail: item.poster_path ? imageUrl(item.poster_path, imageSizes.poster) : MISSING_IMAGE,
    backdrop: item.backdrop_path ? imageUrl(item.backdrop_path, imageSizes.backdrop) : undefined,
    // List results don't include a runtime.
    runtime: 0,
    genre: genreName(genres.get(item.genre_ids[0])),
    year: yearOf(releaseDateOf(item)),
    rating: UNRATED,
    score: Math.round(item.vote_average * 10) / 10,
    // Until there are personal recommendations, "match" is the audience score as a percentage.
    match: Math.round(item.vote_average * 10),
    formats: [PLAYBACK_CONFIG.format],
    progress: 0,
    videoUrl: PLAYBACK_CONFIG.sampleVideoUrl,
  };
  return "title" in item
    ? { ...shared, id: toTitleId("movie", item.id), type: "movie", title: item.title }
    : { ...shared, id: toTitleId("series", item.id), type: "series", title: item.name };
};

/** A page of list results, minus the stubs. */
export const mapSummaries = (items: TmdbSummary[], genres: GenreMap): Video[] =>
  items.filter(isListable).map(item => mapSummary(item, genres));

/** Trending and multi-search results; people are dropped. */
export const mapMultiResults = (items: TmdbMultiResult[], genres: GenreMap): Video[] =>
  mapSummaries(items.flatMap(item => (item.media_type === "person" ? [] : [item])), genres);

/** Directors (movies) or creators (series) first, then the cast in billing order; one card per person. */
const mapCredits = (credits: TmdbCredits, leads: string[], leadRole: string): CastMember[] => {
  const people: CastMember[] = [
    ...leads.map(name => ({ name, role: leadRole, credits: "Crew" })),
    ...[...credits.cast]
      .sort((a, b) => a.order - b.order)
      .map(member => ({ name: member.name, role: member.character || "Cast", credits: "Cast" })),
  ];
  const seen = new Set<string>();
  return people
    .filter(person => {
      if (seen.has(person.name)) return false;
      seen.add(person.name);
      return true;
    })
    .slice(0, CATALOG_CONFIG.maxCredits);
};

const mapEpisode = (titleId: string, episode: TmdbEpisode, fallbackRuntime: number, fallbackThumbnail: string): Episode => ({
  id: toEpisodeId(titleId, episode.season_number, episode.episode_number),
  season: episode.season_number,
  number: episode.episode_number,
  title: episode.name || `Episode ${episode.episode_number}`,
  description: episode.overview,
  runtime: episode.runtime ?? fallbackRuntime,
  airDate: episode.air_date ? formatAirDate(episode.air_date) : "",
  format: PLAYBACK_CONFIG.format,
  progress: 0,
  thumbnail: episode.still_path ? imageUrl(episode.still_path, imageSizes.still) : fallbackThumbnail,
});

/** YouTube key of the best trailer: an official trailer first, then any trailer, then a teaser. */
export const pickTrailerKey = (videos: TmdbVideos | undefined): string | undefined => {
  const youtube = videos?.results.filter(video => video.site === "YouTube" && video.key) ?? [];
  const trailers = youtube.filter(video => video.type === "Trailer");
  return (
    trailers.find(video => video.official)?.key ??
    trailers[0]?.key ??
    youtube.find(video => video.type === "Teaser")?.key
  );
};

/** The configured region's certification, e.g. "PG-13". */
const movieRating = (detail: TmdbMovieDetail) =>
  detail.release_dates.results
    .find(entry => entry.iso_3166_1 === TMDB_CONFIG.region)
    ?.release_dates.map(release => release.certification)
    .find(Boolean) || UNRATED;

const seriesRating = (detail: TmdbTvDetail) =>
  detail.content_ratings.results.find(entry => entry.iso_3166_1 === TMDB_CONFIG.region)?.rating || UNRATED;

export const mapMovieDetail = (detail: TmdbMovieDetail, genres: GenreMap): TitleDetails => ({
  video: {
    ...mapSummary({ ...detail, genre_ids: detail.genres.map(genre => genre.id) }, genres),
    tagline: detail.tagline || undefined,
    runtime: detail.runtime ?? 0,
    rating: movieRating(detail),
    trailerKey: pickTrailerKey(detail.videos),
    cast: mapCredits(
      detail.credits,
      detail.credits.crew.filter(member => member.job === "Director").map(member => member.name),
      "Director",
    ),
  },
  recommendations: mapSummaries(detail.recommendations.results, genres),
});

/** `seasons` are the regular seasons' episode lists; specials (season 0) and unaired episodes are left out. */
export const mapTvDetail = (detail: TmdbTvDetail, seasons: TmdbSeason[], genres: GenreMap): TitleDetails => {
  const base = mapSummary({ ...detail, genre_ids: detail.genres.map(genre => genre.id) }, genres);
  const typicalRuntime = detail.episode_run_time[0] ?? 0;
  const episodes = seasons
    .filter(season => season.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number)
    .flatMap(season =>
      season.episodes
        .filter(hasAired)
        .map(episode => mapEpisode(base.id, episode, typicalRuntime, base.backdrop ?? base.thumbnail)),
    );

  return {
    video: {
      ...base,
      tagline: detail.tagline || undefined,
      runtime: typicalRuntime || episodes.find(episode => episode.runtime > 0)?.runtime || 0,
      rating: seriesRating(detail),
      trailerKey: pickTrailerKey(detail.videos),
      seasonCount: new Set(episodes.map(episode => episode.season)).size || detail.number_of_seasons,
      episodes,
      cast: mapCredits(detail.credits, detail.created_by.map(creator => creator.name), "Creator"),
    },
    recommendations: mapSummaries(detail.recommendations.results, genres),
  };
};
