import VideoDetail from "@/features/catalog/components/VideoDetail";
import type { CatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { useVideoLibrary } from "@/features/catalog/hooks/useVideoLibrary";
import VideoPlayer from "@/features/player/components/VideoPlayer";

interface CatalogOverlaysProps {
  browser: CatalogBrowser;
}

/**
 * The detail modal + fullscreen player, wired to the shared library.
 * Every browse screen renders exactly this, so playback behaves identically
 * on Home, Movies, Series and My List.
 */
const CatalogOverlays = ({ browser }: CatalogOverlaysProps) => {
  const { updateProgress } = useVideoLibrary();

  return (
    <>
      {browser.detail && (
        <VideoDetail
          video={browser.detail}
          onClose={browser.closeDetail}
          onPlay={browser.playFromDetail}
        />
      )}
      {browser.playing && (
        <VideoPlayer
          video={browser.playing}
          onClose={browser.closePlayer}
          onProgressUpdate={updateProgress}
        />
      )}
    </>
  );
};

export default CatalogOverlays;
