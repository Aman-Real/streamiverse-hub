import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SEARCH_PARAM } from "@/app/routes";

/**
 * The navbar search text, kept in the URL (?q=) so it survives reloads and Back, and so the navbar
 * and the page it filters always read the same value. Typing replaces the history entry instead of
 * adding one per keystroke.
 */
export const useSearchQuery = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get(SEARCH_PARAM) ?? "";

  const setQuery = useCallback(
    (next: string) =>
      setParams(
        previous => {
          const updated = new URLSearchParams(previous);
          if (next) updated.set(SEARCH_PARAM, next);
          else updated.delete(SEARCH_PARAM);
          return updated;
        },
        { replace: true },
      ),
    [setParams],
  );

  return [query, setQuery] as const;
};
