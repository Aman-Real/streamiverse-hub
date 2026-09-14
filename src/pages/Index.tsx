import { useMemo } from "react";
import PageShell from "@/components/layout/PageShell";
import CatalogOverlays from "@/features/catalog/components/CatalogOverlays";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import HeroBanner from "@/features/catalog/components/HeroBanner";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { useVideoLibrary } from "@/features/catalog/hooks/useVideoLibrary";
import { buildHomeCategories, searchVideos } from "@/features/catalog/utils/catalog";

const Index = () => {
  const { videos } = useVideoLibrary();
  const browser = useCatalogBrowser();
  const heroVideo = videos[0];

  const rows = useMemo(() => {
    if (!browser.search.trim()) return buildHomeCategories(videos);
    const results = searchVideos(videos, browser.search);
    return results.length ? [{ name: "Search Results", items: results }] : [];
  }, [videos, browser.search]);

  return (
    <PageShell onSearch={browser.setSearch} withFooter>
      {heroVideo && (
        <HeroBanner video={heroVideo} onPlay={browser.openPlayer} onInfo={browser.openDetail} />
      )}
      <div className="-mt-24 relative z-10">
        {rows.map(row => (
          <CategoryRow
            key={row.name}
            title={row.name}
            videos={row.items}
            onPlay={browser.openPlayer}
            onInfo={browser.openDetail}
          />
        ))}
      </div>
      <CatalogOverlays browser={browser} />
    </PageShell>
  );
};

export default Index;
