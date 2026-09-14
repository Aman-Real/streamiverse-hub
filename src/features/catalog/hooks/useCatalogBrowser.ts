import { useCallback, useMemo, useState } from "react";
import type { Video } from "@/features/catalog/types";

export interface CatalogBrowser {
  search: string;
  setSearch: (query: string) => void;
  detail: Video | null;
  playing: Video | null;
  openDetail: (video: Video) => void;
  closeDetail: () => void;
  openPlayer: (video: Video) => void;
  closePlayer: () => void;
  /** Close the detail modal and start playback in one step. */
  playFromDetail: (video: Video) => void;
}

/**
 * The search / detail-modal / player state every browse screen needs.
 * Pair it with <CatalogOverlays browser={browser} /> to render the modals.
 */
export const useCatalogBrowser = (): CatalogBrowser => {
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Video | null>(null);
  const [playing, setPlaying] = useState<Video | null>(null);

  const openDetail = useCallback((video: Video) => setDetail(video), []);
  const closeDetail = useCallback(() => setDetail(null), []);
  const openPlayer = useCallback((video: Video) => setPlaying(video), []);
  const closePlayer = useCallback(() => setPlaying(null), []);

  const playFromDetail = useCallback((video: Video) => {
    setDetail(null);
    setPlaying(video);
  }, []);

  return useMemo(
    () => ({
      search,
      setSearch,
      detail,
      playing,
      openDetail,
      closeDetail,
      openPlayer,
      closePlayer,
      playFromDetail,
    }),
    [search, detail, playing, openDetail, closeDetail, openPlayer, closePlayer, playFromDetail],
  );
};
