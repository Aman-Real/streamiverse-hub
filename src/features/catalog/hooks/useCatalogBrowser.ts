import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, titleRoute, watchRoute } from "@/app/routes";
import { useSearchQuery } from "@/features/catalog/hooks/useSearchQuery";
import type { Episode, Video } from "@/features/catalog/types";

export interface CatalogBrowser {
  /** The navbar search text for this page. */
  search: string;
  setSearch: (query: string) => void;
  /** Open the title's Explore page. Guests are asked to sign in first (see RequireAuth). */
  openDetail: (video: Video) => void;
  /** Start playback in the Watch Room. Without an episode, series resume where the viewer stopped. */
  openPlayer: (video: Video, episode?: Episode) => void;
}

/** The search state and title navigation every browse screen needs. */
export const useCatalogBrowser = (): CatalogBrowser => {
  const [search, setSearch] = useSearchQuery();
  const navigate = useNavigate();

  const openDetail = useCallback((video: Video) => navigate(titleRoute(ROUTES.explore, video.id)), [navigate]);
  const openPlayer = useCallback(
    (video: Video, episode?: Episode) =>
      navigate(watchRoute(video.id, episode && { season: episode.season, episode: episode.number })),
    [navigate],
  );

  return useMemo(() => ({ search, setSearch, openDetail, openPlayer }), [search, setSearch, openDetail, openPlayer]);
};
