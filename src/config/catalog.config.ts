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

/** What the catalog shows and how it searches. */
export const CATALOG_CONFIG = {
  genreRows: GENRE_ROWS,
  /** Titles with fewer TMDB votes stay out of genre rows, which keeps obscure entries out. */
  minVoteCount: 200,
  /** Wait this long after the last keystroke before searching TMDB. */
  searchDebounceMs: 350,
  /** Cast and crew cards kept per title. */
  maxCredits: 12,
} as const;
