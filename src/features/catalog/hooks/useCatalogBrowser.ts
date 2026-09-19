import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, titleRoute } from "@/app/routes";
import type { Video } from "@/features/catalog/types";

export interface CatalogBrowser {
  search: string;
  setSearch: (query: string) => void;
  /** Open the title's Explore page. */
  openDetail: (video: Video) => void;
  /** Start playback in the Watch Room. */
  openPlayer: (video: Video) => void;
}

/** The search state and title navigation every browse screen needs. */
export const useCatalogBrowser = (): CatalogBrowser => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const openDetail = useCallback((video: Video) => navigate(titleRoute(ROUTES.explore, video.id)), [navigate]);
  const openPlayer = useCallback((video: Video) => navigate(titleRoute(ROUTES.watch, video.id)), [navigate]);

  return useMemo(() => ({ search, setSearch, openDetail, openPlayer }), [search, openDetail, openPlayer]);
};
