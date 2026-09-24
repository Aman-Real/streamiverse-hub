import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { CATALOG_CONFIG } from "@/config/catalog.config";
import * as catalogApi from "@/features/catalog/api/catalog.api";
import type { Video, VideoCategory, VideoType } from "@/features/catalog/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

/*
 * Catalog data for components. Each hook caches one catalog.api call in React Query,
 * so screens showing the same list share a single request.
 */

/** Stable empty list for `data ?? NO_VIDEOS`, so memoized consumers don't recompute every render. */
export const NO_VIDEOS: Video[] = [];

/** Every catalog query key, in one place so invalidation never misses a spelling. */
export const catalogKeys = {
  all: ["catalog"] as const,
  trending: () => [...catalogKeys.all, "trending"] as const,
  topRatedSeries: () => [...catalogKeys.all, "top-rated-series"] as const,
  genreRow: (type: VideoType, genreId: number) => [...catalogKeys.all, "genre", type, genreId] as const,
  search: (type: VideoType | "all", query: string) => [...catalogKeys.all, "search", type, query] as const,
  title: (id: string) => [...catalogKeys.all, "title", id] as const,
};

/** This week's most-watched movies and series. Pass false to skip loading when the screen doesn't need it. */
export const useTrending = (enabled = true) =>
  useQuery({
    queryKey: catalogKeys.trending(),
    queryFn: ({ signal }) => catalogApi.fetchTrending(signal),
    enabled,
  });

export const useTopRatedSeries = () =>
  useQuery({
    queryKey: catalogKeys.topRatedSeries(),
    queryFn: ({ signal }) => catalogApi.fetchTopRatedSeries(signal),
  });

/** One title's details and recommendations. Waits while `id` is undefined. */
export const useTitle = (id: string | undefined) =>
  useQuery({
    queryKey: catalogKeys.title(id ?? ""),
    queryFn: ({ signal }) => catalogApi.fetchTitle(id ?? "", signal),
    enabled: Boolean(id),
  });

/**
 * Search-as-you-type: TMDB is asked once typing pauses, and the previous results stay on screen
 * until the new ones arrive. `isSearching` covers both the pause and the request.
 */
export const useTitleSearch = (query: string, type: VideoType | "all") => {
  const trimmed = query.trim();
  const term = useDebouncedValue(trimmed, CATALOG_CONFIG.searchDebounceMs);
  const { data, isFetching } = useQuery({
    queryKey: catalogKeys.search(type, term),
    queryFn: ({ signal }) => catalogApi.searchTitles(term, type, signal),
    enabled: term.length > 0,
    placeholderData: keepPreviousData,
  });
  return { results: data ?? NO_VIDEOS, isSearching: trimmed !== term || isFetching };
};

/** The configured genre rows for one type, loaded in parallel. Rows appear as they arrive; empty ones are dropped. */
export const useGenreRows = (type: VideoType, enabled = true) => {
  const rows = CATALOG_CONFIG.genreRows[type];
  const results = useQueries({
    queries: rows.map(row => ({
      queryKey: catalogKeys.genreRow(type, row.genreId),
      queryFn: ({ signal }: { signal: AbortSignal }) => catalogApi.fetchGenreRow(type, row.genreId, signal),
      enabled,
    })),
  });

  const categories: VideoCategory[] = rows
    .map((row, index) => ({ name: row.label, items: results[index]?.data ?? NO_VIDEOS }))
    .filter(category => category.items.length > 0);

  return { rows: categories, isLoading: results.some(result => result.isLoading) };
};
