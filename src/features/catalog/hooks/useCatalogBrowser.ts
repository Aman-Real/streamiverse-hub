import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, titleRoute, watchRoute } from "@/app/routes";
import type { Episode, Video } from "@/features/catalog/types";

export interface CatalogBrowser {
  search: string;
  setSearch: (query: string) => void;
  /** Open the title's Explore page. */
  openDetail: (video: Video) => void;
  /** Start playback in the Watch Room. Without an episode, series resume where the viewer stopped. */
  openPlayer: (video: Video, episode?: Episode) => void;
}

/** The search state and title navigation every browse screen needs. */
export const useCatalogBrowser = (): CatalogBrowser => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const openDetail = useCallback((video: Video) => navigate(titleRoute(ROUTES.explore, video.id)), [navigate]);
  const openPlayer = useCallback(
    (video: Video, episode?: Episode) =>
      navigate(watchRoute(video.id, episode && { season: episode.season, episode: episode.number })),
    [navigate],
  );

  return useMemo(() => ({ search, setSearch, openDetail, openPlayer }), [search, openDetail, openPlayer]);
};
