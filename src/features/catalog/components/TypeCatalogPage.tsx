import { useMemo } from "react";
import PageShell from "@/components/layout/PageShell";
import CatalogOverlays from "@/features/catalog/components/CatalogOverlays";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { useVideoLibrary } from "@/features/catalog/hooks/useVideoLibrary";
import type { VideoType } from "@/features/catalog/types";
import { filterByType, groupByGenre, searchVideos } from "@/features/catalog/utils/catalog";

interface TypeCatalogPageProps {
  title: string;
  type: VideoType;
  emptyMessage: string;
}

/**
 * A full "browse everything of one type, grouped by genre" screen.
 * Movies and Series are the same screen with different props.
 */
const TypeCatalogPage = ({ title, type, emptyMessage }: TypeCatalogPageProps) => {
  const { videos } = useVideoLibrary();
  const browser = useCatalogBrowser();

  const rows = useMemo(
    () => groupByGenre(searchVideos(filterByType(videos, type), browser.search)),
    [videos, type, browser.search],
  );

  return (
    <PageShell onSearch={browser.setSearch} withFooter>
      <div className="pt-24 px-6 md:px-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">{title}</h1>
        {rows.length === 0 && (
          <p className="text-muted-foreground text-center py-20">{emptyMessage}</p>
        )}
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

export default TypeCatalogPage;
