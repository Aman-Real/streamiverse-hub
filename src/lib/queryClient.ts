import { QueryClient } from "@tanstack/react-query";

/**
 * Shared React Query client.
 * Set global defaults here (staleTime, retry, refetchOnWindowFocus) once you
 * start fetching from a real API. Today nothing queries, so defaults are fine.
 */
export const queryClient = new QueryClient();
