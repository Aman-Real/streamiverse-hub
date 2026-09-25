import { Clapperboard, Info, Popcorn, RotateCcw } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { ROUTES, titleRoute, watchRoute } from "@/app/routes";
import LoadingState from "@/components/common/LoadingState";
import PageHeader from "@/components/common/PageHeader";
import Rating from "@/components/common/Rating";
import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import type { CollectionKey } from "@/features/catalog/api/catalog.api";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import VideoCard from "@/features/catalog/components/VideoCard";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { NO_VIDEOS, useCollection, useTitle } from "@/features/catalog/hooks/useCatalogQueries";
import type { Video } from "@/features/catalog/types";
import { dedupeCategories } from "@/features/catalog/utils/catalog";
import { useWatchProgress } from "@/features/watch-progress/hooks/useWatchProgress";
import type { ProgressEntry } from "@/features/watch-progress/types";
import { planWatchRoom } from "@/features/watch-progress/utils/progress";

/**
 * Cards that start playback, since everything in the Watch Room is one tap from watching.
 * A plain array (not a component) so CategoryRow can count the cards and hide or show placeholders.
 */
const playableCards = (videos: Video[], onPlay: (video: Video) => void) =>
  videos.map(video => (
    <VideoCard
      key={video.id}
      video={video}
      onSelect={onPlay}
      meta={`${video.type === "movie" ? "Movie" : "Series"} • ${video.year || "New"}`}
      aside={<Rating value={video.score} />}
    />
  ));

const DISCOVER_ROWS: { key: CollectionKey; title: string }[] = [
  { key: "latestMovies", title: "Latest Movies" },
  { key: "latestWebSeries", title: "Latest Web Series" },
  { key: "latestAnime", title: "Latest Anime" },
  { key: "latestTvShows", title: "Latest TV Shows" },
];

/** First visit: the newest movies, web series, anime and TV shows. A title appears in one row only. */
const DiscoverView = () => {
  const browser = useCatalogBrowser();
  const movies = useCollection("latestMovies");
  const webSeries = useCollection("latestWebSeries");
  const anime = useCollection("latestAnime");
  const tvShows = useCollection("latestTvShows");
  const queries = [movies, webSeries, anime, tvShows];
  const rows = dedupeCategories(DISCOVER_ROWS.map((row, index) => ({ name: row.title, items: queries[index].data ?? NO_VIDEOS })));

  return (
    <>
      <PageHeader
        title="Start watching"
        icon={Popcorn}
        description="Fresh picks to get you going: the latest movies, web series, anime and TV shows."
      />
      {DISCOVER_ROWS.map((row, index) => (
        <CategoryRow key={row.key} title={row.title} loading={queries[index].isLoading}>
          {playableCards(rows.find(category => category.name === row.title)?.items ?? NO_VIDEOS, browser.openPlayer)}
        </CategoryRow>
      ))}
    </>
  );
};

/** Finished a movie or a whole series: offer a rewatch and titles like it. */
const FinishedView = ({ latest }: { latest: ProgressEntry }) => {
  const browser = useCatalogBrowser();
  const navigate = useNavigate();
  const { title } = latest;
  const isMovie = title.type === "movie";
  const details = useTitle(title.id);
  const related = details.data?.recommendations ?? NO_VIDEOS;
  const showFallback = !details.isLoading && related.length === 0;
  const fallback = useCollection(isMovie ? "latestMovies" : "latestWebSeries", showFallback);
  const firstEpisode = details.data?.video.episodes?.[0];
  const rewatchPath = isMovie
    ? watchRoute(title.id)
    : watchRoute(title.id, { season: firstEpisode?.season ?? 1, episode: firstEpisode?.number ?? 1 });

  return (
    <>
      <PageHeader
        title={`You finished ${title.title}`}
        icon={Clapperboard}
        description={
          isMovie ? "Here are movies like it, ready to play." : "You've watched every episode. Here are similar shows to start next."
        }
        action={
          <>
            <Button onClick={() => navigate(rewatchPath)}>
              <RotateCcw /> Watch again
            </Button>
            <Button variant="outline" onClick={() => navigate(titleRoute(ROUTES.explore, title.id))}>
              <Info /> Details
            </Button>
          </>
        }
      />
      <CategoryRow title={`More like ${title.title}`} loading={details.isLoading}>
        {playableCards(related, browser.openPlayer)}
      </CategoryRow>
      {showFallback && (
        <CategoryRow title={isMovie ? "Latest Movies" : "Latest Web Series"} loading={fallback.isLoading}>
          {playableCards(fallback.data ?? NO_VIDEOS, browser.openPlayer)}
        </CategoryRow>
      )}
    </>
  );
};

/**
 * /watch without a title: the Watch Room button. It resumes what the viewer was watching, starts the next
 * episode of a finished one, suggests similar titles after a finished movie or series, and shows the
 * latest releases to someone who hasn't watched anything yet.
 */
const WatchRoomHub = () => {
  const { loading, history, getProgress } = useWatchProgress();
  const latest = history[0] ? getProgress(history[0].id) : undefined;
  // Only a finished series episode needs the episode list, to find the next one.
  const needsEpisodes = Boolean(latest && latest.progress >= 100 && latest.title.type === "series");
  const { data, error } = useTitle(needsEpisodes ? latest?.title.id : undefined);
  const plan = loading ? ({ kind: "loading" } as const) : planWatchRoom(latest, data?.video, Boolean(error));

  if (plan.kind === "play") return <Navigate to={watchRoute(plan.titleId, plan.episode)} replace />;

  return (
    <PageShell withFooter>
      <div className="page-container">
        {plan.kind === "loading" && <LoadingState label="Opening your Watch Room…" />}
        {plan.kind === "discover" && <DiscoverView />}
        {plan.kind === "finished" && latest && <FinishedView latest={latest} />}
      </div>
    </PageShell>
  );
};

export default WatchRoomHub;
