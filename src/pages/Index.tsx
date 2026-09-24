import { Info, Play } from "lucide-react";
import { ROUTES } from "@/app/routes";
import Rating from "@/components/common/Rating";
import { SectionLink } from "@/components/common/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import HeroBanner from "@/features/catalog/components/HeroBanner";
import VideoCard from "@/features/catalog/components/VideoCard";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { NO_VIDEOS, useTitleSearch, useTopRatedSeries, useTrending } from "@/features/catalog/hooks/useCatalogQueries";
import { formatLength, getResumeLabel } from "@/features/catalog/utils/catalog";
import MyListButton from "@/features/my-list/components/MyListButton";
import { useWatchProgress } from "@/features/watch-progress/hooks/useWatchProgress";

const Index = () => {
  const browser = useCatalogBrowser();
  const { continueWatching } = useWatchProgress();
  const { data: trending = NO_VIDEOS } = useTrending();
  const { data: topRatedSeries = NO_VIDEOS } = useTopRatedSeries();
  const { results, isSearching } = useTitleSearch(browser.search, "all");
  // The hero needs wide artwork, so feature the top trending title that has some.
  const featured = trending.find(video => video.backdrop) ?? trending[0];

  return (
    <PageShell onSearch={browser.setSearch} withFooter>
      <div className="page-container">
        {browser.search.trim() ? (
          <>
            <CategoryRow title="Search Results" count={`${results.length} titles`}>
              {results.map(video => (
                <VideoCard key={video.id} video={video} onSelect={browser.openDetail} meta={`${video.genre} • ${video.year}`} />
              ))}
            </CategoryRow>
            {results.length === 0 && !isSearching && <p className="py-20 text-center text-muted-foreground">No titles match your search.</p>}
          </>
        ) : (
          <>
            {featured && (
              <HeroBanner
                video={featured}
                label="Featured"
                tags={[featured.genre, String(featured.year), formatLength(featured)]}
                actions={
                  <>
                    <Button onClick={() => browser.openPlayer(featured)}><Play className="fill-current" /> Play</Button>
                    <MyListButton video={featured} label="My List" />
                    <Button variant="outline" onClick={() => browser.openDetail(featured)}><Info /> Details</Button>
                  </>
                }
              />
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
            <CategoryRow title="Trending Now" action={<SectionLink to={ROUTES.movies} label="Explore All" />}>
              {trending.map(video => (
                <VideoCard key={video.id} video={video} onSelect={browser.openDetail} meta={`${video.genre} • ${video.year}`} />
              ))}
            </CategoryRow>
            <CategoryRow title="Top Rated Series" action={<SectionLink to={ROUTES.series} />}>
              {topRatedSeries.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSelect={browser.openDetail}
                  meta={`${video.genre} • ${formatLength(video)}`}
                  aside={<Rating value={video.score} />}
                />
              ))}
            </CategoryRow>
          </>
        )}
      </div>
    </PageShell>
  );
};

export default Index;
