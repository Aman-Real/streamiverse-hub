import type { VideoType } from "@/features/catalog/types";

/** One browse row on the Movies or Series screen: a TMDB genre, most popular titles first. */
export interface GenreRowConfig {
  /** TMDB's own genre id (these never change). */
  genreId: number;
  /** Row heading. */
  label: string;
}

/** Movies and Series screen rows, in display order. */
const GENRE_ROWS: Record<VideoType, readonly GenreRowConfig[]> = {
  movie: [
    { genreId: 28, label: "Action" },
    { genreId: 35, label: "Comedy" },
    { genreId: 18, label: "Drama" },
    { genreId: 878, label: "Sci-Fi" },
    { genreId: 53, label: "Thriller" },
    { genreId: 16, label: "Animation" },
    { genreId: 27, label: "Horror" },
    { genreId: 10749, label: "Romance" },
  ],
  series: [
    { genreId: 18, label: "Drama" },
    { genreId: 35, label: "Comedy" },
    { genreId: 80, label: "Crime" },
    { genreId: 10765, label: "Sci-Fi & Fantasy" },
    { genreId: 10759, label: "Action & Adventure" },
    { genreId: 9648, label: "Mystery" },
    { genreId: 16, label: "Animation" },
    { genreId: 99, label: "Documentary" },
  ],
};

/**
 * One choice in the home screen's "Your Genre" picker. TMDB numbers movie and series genres
 * separately (and has no Horror, Thriller or Romance for series), so each choice names its own ids.
 */
export interface GenreOption {
  /** Stable key, also the picker value. */
  id: string;
  label: string;
  movieGenreId?: number;
  seriesGenreId?: number;
  /** Other TMDB genre names that count as this choice when guessing the viewer's favourite. */
  aliases?: readonly string[];
}

/** "Your Genre" choices, in display order. The first is the default for new viewers. */
const GENRE_OPTIONS: readonly GenreOption[] = [
  { id: "thriller", label: "Thriller", movieGenreId: 53 },
  { id: "horror", label: "Horror", movieGenreId: 27 },
  { id: "romance", label: "Romance", movieGenreId: 10749 },
  { id: "comedy", label: "Comedy", movieGenreId: 35, seriesGenreId: 35 },
  { id: "action", label: "Action", movieGenreId: 28, seriesGenreId: 10759, aliases: ["Action & Adventure"] },
  { id: "sci-fi", label: "Sci-Fi", movieGenreId: 878, seriesGenreId: 10765, aliases: ["Sci-Fi & Fantasy", "Science Fiction"] },
  { id: "drama", label: "Drama", movieGenreId: 18, seriesGenreId: 18 },
  { id: "mystery", label: "Mystery", movieGenreId: 9648, seriesGenreId: 9648 },
  { id: "crime", label: "Crime", movieGenreId: 80, seriesGenreId: 80 },
  { id: "fantasy", label: "Fantasy", movieGenreId: 14 },
  { id: "adventure", label: "Adventure", movieGenreId: 12 },
  { id: "animation", label: "Animation", movieGenreId: 16, seriesGenreId: 16 },
  { id: "family", label: "Family", movieGenreId: 10751, seriesGenreId: 10751, aliases: ["Kids"] },
  { id: "documentary", label: "Documentary", movieGenreId: 99, seriesGenreId: 99 },
  { id: "war", label: "War", movieGenreId: 10752, seriesGenreId: 10768, aliases: ["War & Politics"] },
  { id: "western", label: "Western", movieGenreId: 37, seriesGenreId: 37 },
];

/** TMDB's ids for the big streaming services, for the "latest web series" row. */
const STREAMING_NETWORKS = [
  213, // Netflix
  1024, // Prime Video
  2739, // Disney+
  2552, // Apple TV+
  453, // Hulu
  3186, // HBO Max
  4330, // Paramount+
  3353, // Peacock
] as const;

/** What the catalog shows and how it searches. */
export const CATALOG_CONFIG = {
  genreRows: GENRE_ROWS,
  genreOptions: GENRE_OPTIONS,
  /** Titles with fewer TMDB votes stay out of genre rows, which keeps obscure entries out. */
  minVoteCount: 200,
  /** New releases haven't collected many votes yet, so "latest" rows use a lower bar. */
  minVoteCountLatest: 20,
  /** Wait this long after the last keystroke before searching TMDB. */
  searchDebounceMs: 350,
  /** Cast and crew cards kept per title. */
  maxCredits: 12,
  /** Anime: Japanese-language animation. */
  anime: { genreId: 16, originalLanguage: "ja" },
  streamingNetworks: STREAMING_NETWORKS,
  /** How far back each "latest" row looks, in days. */
  latestWindowDays: { webSeries: 365, anime: 90, tvShows: 30 },
  /** Series genres that aren't shows people binge (news, reality, talk), left out of "latest TV shows". */
  excludedTvGenres: [10763, 10764, 10767],
} as const;
