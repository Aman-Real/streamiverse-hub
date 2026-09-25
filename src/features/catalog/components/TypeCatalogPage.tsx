import { Film, SearchX, Tv } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import Rating from "@/components/common/Rating";
import PageShell from "@/components/layout/PageShell";
import CategoryRow, { CategoryRowSkeleton } from "@/features/catalog/components/CategoryRow";
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

/** Placeholder rows while the genre rows load. */
const LOADING_ROWS = 3;

/**
 * A full "browse everything of one type, grouped by genre" screen.
 * Movies and Series are the same screen with different props.
 * Browsing shows the configured genre rows; searching groups TMDB's results by genre instead.
 */
const TypeCatalogPage = ({ title, type, emptyMessage }: TypeCatalogPageProps) => {
  const browser = useCatalogBrowser();
  const query = browser.search.trim();
  const searching = query.length > 0;
  const genreRows = useGenreRows(type, !searching);
  const search = useTitleSearch(browser.search, type);

  const rows = searching ? groupByGenre(search.results) : genreRows.rows;
  const loading = searching ? search.isSearching : genreRows.isLoading;

  return (
    <PageShell searchable withFooter>
      <div className="page-container">
        <PageHeader
          title={searching ? `${title} matching "${query}"` : title}
          icon={type === "movie" ? Film : Tv}
          description={searching ? undefined : `Popular ${title.toLowerCase()} by genre.`}
        />
        {rows.length === 0 && !loading && <EmptyState icon={SearchX} title={emptyMessage} description="Try a different title or spelling." />}
        {rows.length === 0 && loading && Array.from({ length: LOADING_ROWS }, (_, index) => <CategoryRowSkeleton key={index} />)}
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
