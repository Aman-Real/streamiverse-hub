import { Info, Play, SearchX } from "lucide-react";
import { useMemo } from "react";
import { ROUTES } from "@/app/routes";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import Rating from "@/components/common/Rating";
import { SectionLink } from "@/components/common/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CATALOG_CONFIG } from "@/config/catalog.config";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import GenreRow from "@/features/catalog/components/GenreRow";
import HeroBanner from "@/features/catalog/components/HeroBanner";
import VideoCard from "@/features/catalog/components/VideoCard";
import VideoGrid from "@/features/catalog/components/VideoGrid";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { NO_VIDEOS, useCollection, useTitleSearch } from "@/features/catalog/hooks/useCatalogQueries";
import type { Video } from "@/features/catalog/types";
import { favouriteGenreOption, formatLength, getResumeLabel } from "@/features/catalog/utils/catalog";
import MyListButton from "@/features/my-list/components/MyListButton";
import { useWatchProgress } from "@/features/watch-progress/hooks/useWatchProgress";

const typeLabel = (video: Video) => (video.type === "movie" ? "Movie" : "Series");

/**
 * Home: a featured title, then rows to browse (continue watching, trending, top rated movies and series,
 * anime and a genre picker). Typing in the navbar search swaps the rows for a grid of results.
 */
const Index = () => {
  const browser = useCatalogBrowser();
  const { continueWatching, history } = useWatchProgress();
  const trending = useCollection("trending");
  const topRatedMovies = useCollection("topRatedMovies");
  const topRatedSeries = useCollection("topRatedSeries");
  const anime = useCollection("anime");
  const query = browser.search.trim();
  const { results, isSearching } = useTitleSearch(browser.search, "all");
  const trendingVideos = trending.data ?? NO_VIDEOS;
  // The hero needs wide artwork, so feature the top trending title that has some.
  const featured = trendingVideos.find(video => video.backdrop) ?? trendingVideos[0];
  const favouriteGenre = useMemo(() => favouriteGenreOption(CATALOG_CONFIG.genreOptions, history), [history]);

  return (
    <PageShell searchable withFooter>
      <div className="page-container">
        {query ? (
          <section className="space-y-6">
            <PageHeader
              title={`Results for "${query}"`}
              description={isSearching ? "Searching…" : `${results.length} ${results.length === 1 ? "title" : "titles"}`}
            />
            {results.length === 0 && !isSearching ? (
              <EmptyState icon={SearchX} title="No titles match your search." description="Check the spelling, or try the title in English." />
            ) : (
              <VideoGrid loading={isSearching && results.length === 0}>
                {results.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onSelect={browser.openDetail}
                    meta={`${typeLabel(video)} • ${video.year || "—"}`}
                    aside={<Rating value={video.score} />}
                  />
                ))}
              </VideoGrid>
            )}
          </section>
        ) : (
          <>
            {featured ? (
              <HeroBanner
                video={featured}
                label="Featured"
                tags={[featured.genre, String(featured.year), formatLength(featured)]}
                actions={
                  <>
                    <Button onClick={() => browser.openPlayer(featured)}><Play className="fill-current" /> Play</Button>
                    <MyListButton video={featured} showLabel />
                    <Button variant="outline" onClick={() => browser.openDetail(featured)}><Info /> Details</Button>
                  </>
                }
              />
            ) : (
              trending.isLoading && <Skeleton className="h-[22rem] rounded-3xl sm:h-[26rem]" />
            )}

            <CategoryRow
              title="Continue Watching"
              count={`${continueWatching.length} in progress`}
              columns={4}
              action={<SectionLink to={ROUTES.myList} />}
            >
              {continueWatching.map(video => (
                <VideoCard key={video.id} video={video} variant="landscape" onSelect={browser.openPlayer} meta={getResumeLabel(video)} />
              ))}
            </CategoryRow>

            <CategoryRow title="Trending Now" loading={trending.isLoading}>
              {trendingVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSelect={browser.openDetail}
                  meta={`${video.genre} • ${video.year}`}
                  aside={<Rating value={video.score} />}
                />
              ))}
            </CategoryRow>

            <CategoryRow title="Top Rated Movies" loading={topRatedMovies.isLoading} action={<SectionLink to={ROUTES.movies} />}>
              {(topRatedMovies.data ?? NO_VIDEOS).map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSelect={browser.openDetail}
                  meta={`${video.genre} • ${video.year}`}
                  aside={<Rating value={video.score} />}
                />
              ))}
            </CategoryRow>

            <CategoryRow title="Top Rated Series" loading={topRatedSeries.isLoading} action={<SectionLink to={ROUTES.series} />}>
              {(topRatedSeries.data ?? NO_VIDEOS).map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSelect={browser.openDetail}
                  meta={`${video.genre} • ${formatLength(video)}`}
                  aside={<Rating value={video.score} />}
                />
              ))}
            </CategoryRow>

            <CategoryRow title="Anime" loading={anime.isLoading}>
              {(anime.data ?? NO_VIDEOS).map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSelect={browser.openDetail}
                  meta={`Anime • ${video.year}`}
                  aside={<Rating value={video.score} />}
                />
              ))}
            </CategoryRow>

            <GenreRow
              title="Your Genre"
              options={CATALOG_CONFIG.genreOptions}
              initialOptionId={favouriteGenre?.id}
              onSelect={browser.openDetail}
            />
          </>
        )}
      </div>
    </PageShell>
  );
};

export default Index;
