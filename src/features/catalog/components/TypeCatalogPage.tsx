import { useMemo } from "react";
import Rating from "@/components/common/Rating";
import PageShell from "@/components/layout/PageShell";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import VideoCard from "@/features/catalog/components/VideoCard";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { useVideoLibrary } from "@/features/catalog/hooks/useVideoLibrary";
import type { VideoType } from "@/features/catalog/types";
import { filterByType, formatLength, groupByGenre, searchVideos } from "@/features/catalog/utils/catalog";

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
      <div className="page-container">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {rows.length === 0 && <p className="py-20 text-center text-muted-foreground">{emptyMessage}</p>}
        {rows.map(row => (
          <CategoryRow key={row.name} title={row.name}>
            {row.items.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onSelect={browser.openDetail}
                meta={`${video.year} • ${formatLength(video)}`}
                aside={<Rating value={video.score} />}
              />
            ))}
          </CategoryRow>
        ))}
      </div>
    </PageShell>
  );
};

export default TypeCatalogPage;
