import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { describeTmdbError, isTmdbNotFound, TmdbError } from "@/lib/tmdb";

const MINUTE = 60_000;

/** However many rows fail at once, one toast appears. */
const LOAD_ERROR_TOAST_ID = "catalog-load-error";

/** A 4xx (bad token, unknown title) won't fix itself; network errors, 5xx and 429 (rate limit) are retried. */
const shouldRetry = (failureCount: number, error: Error) => {
  const permanent = error instanceof TmdbError && error.status >= 400 && error.status < 500 && error.status !== 429;
  return !permanent && failureCount < 2;
};

/**
 * Shared React Query client. Catalog data changes slowly, so results stay fresh for 10 minutes
 * and aren't refetched just because the tab regained focus.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Screens that already have data keep showing it; an unknown title shows Not Found instead.
      if (query.state.data !== undefined || isTmdbNotFound(error)) return;
      console.error("[TMDB]", error);
      // Developers get the likely fix; visitors get a plain retry message.
      const { title, description } = import.meta.env.DEV
        ? describeTmdbError(error)
        : { title: "Couldn't load titles", description: "Check your connection and try again in a minute." };
      toast.error(title, { id: LOAD_ERROR_TOAST_ID, description });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 10 * MINUTE,
      gcTime: 30 * MINUTE,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
  },
});
