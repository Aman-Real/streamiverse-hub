import Rating from "@/components/common/Rating";
import PageShell from "@/components/layout/PageShell";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import VideoCard from "@/features/catalog/components/VideoCard";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { useGenreRows, useTitleSearch } from "@/features/catalog/hooks/useCatalogQueries";
import type { VideoType } from "@/features/catalog/types";
import { formatLength, groupByGenre } from "@/features/catalog/utils/catalog";

interface TypeCatalogPageProps {
  title: string;
  type: VideoType;
  emptyMessage: string;
}

/**
 * A full "browse everything of one type, grouped by genre" screen.
 * Movies and Series are the same screen with different props.
 * Browsing shows the configured genre rows; searching groups TMDB's results by genre instead.
 */
const TypeCatalogPage = ({ title, type, emptyMessage }: TypeCatalogPageProps) => {
  const browser = useCatalogBrowser();
  const searching = browser.search.trim().length > 0;
  const genreRows = useGenreRows(type, !searching);
  const search = useTitleSearch(browser.search, type);

  const rows = searching ? groupByGenre(search.results) : genreRows.rows;
  const loading = searching ? search.isSearching : genreRows.isLoading;

  return (
    <PageShell onSearch={browser.setSearch} withFooter>
      <div className="page-container">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {rows.length === 0 && !loading && <p className="py-20 text-center text-muted-foreground">{emptyMessage}</p>}
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
