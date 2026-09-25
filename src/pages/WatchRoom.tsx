import { useCallback, useMemo } from "react";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { parseEpisodeRef, ROUTES, watchRoute } from "@/app/routes";
import ErrorState from "@/components/common/ErrorState";
import LoadingState from "@/components/common/LoadingState";
import Rating from "@/components/common/Rating";
import PageShell from "@/components/layout/PageShell";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import EpisodeList from "@/features/catalog/components/EpisodeList";
import VideoCard from "@/features/catalog/components/VideoCard";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { NO_VIDEOS, useTitle } from "@/features/catalog/hooks/useCatalogQueries";
import type { Episode } from "@/features/catalog/types";
import { formatLength, getNextEpisode } from "@/features/catalog/utils/catalog";
import VideoPlayer from "@/features/player/components/VideoPlayer";
import type { PlaybackPosition, ProgressReportOptions } from "@/features/player/types";
import { usePlaybackSettings } from "@/features/settings/hooks/usePlaybackSettings";
import { useWatchProgress } from "@/features/watch-progress/hooks/useWatchProgress";
import { resolveEpisode, resumePosition } from "@/features/watch-progress/utils/progress";
import { isTmdbNotFound } from "@/lib/tmdb";
import NotFound from "@/pages/NotFound";

/**
 * Plays /watch/:id from where the viewer stopped. Series play the episode in ?season=&episode=, else the one
 * in progress (or the next one, if that was finished). When an episode ends, the next one follows
 * automatically if "Autoplay next episode" is on. Below the player: the episode list and similar titles.
 */
const WatchRoom = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const browser = useCatalogBrowser();
  const { loading, getProgress, saveProgress, withProgress } = useWatchProgress();
  const { autoplayNext, quality } = usePlaybackSettings();
  const { data, error, refetch } = useTitle(id);

  const video = data?.video;
  const entry = id ? getProgress(id) : undefined;
  const requestedEpisode = parseEpisodeRef(searchParams);
  const episode = video ? resolveEpisode(video, requestedEpisode, entry) : undefined;
  const nextEpisode = video && episode ? getNextEpisode(video, { season: episode.season, episode: episode.number }) : undefined;
  const videoWithProgress = useMemo(() => (video ? withProgress(video) : undefined), [video, withProgress]);
  const recommendations = data?.recommendations ?? NO_VIDEOS;

  const handleProgressUpdate = useCallback(
    (position: PlaybackPosition, options?: ProgressReportOptions) => {
      if (!video) return;
      saveProgress(video, position, { ...options, episode });
    },
    [video, episode, saveProgress],
  );

  // Autoplay replaces the history entry, so Back leaves the Watch Room instead of stepping through episodes.
  const playNext = useCallback(
    (next: Episode) => {
      if (video) navigate(watchRoute(video.id, { season: next.season, episode: next.number }), { replace: true });
    },
    [video, navigate],
  );

  // Opened straight from a link or bookmark, there's no in-app page to go back to; go home instead.
  // React Router numbers this tab's history entries; 0 is the page the visitor arrived on.
  const goBack = () => {
    const index = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (index > 0) navigate(-1);
    else navigate(ROUTES.home);
  };

  if (isTmdbNotFound(error)) return <NotFound />;

  // Pin the chosen episode in the URL once it's known. Otherwise finishing it would update watch progress,
  // which would re-pick the episode mid-playback and skip the "Up next" card and the autoplay setting.
  if (video && episode && !requestedEpisode && !loading) {
    return <Navigate to={watchRoute(video.id, { season: episode.season, episode: episode.number })} replace state={location.state} />;
  }

  return (
    <PageShell withFooter>
      <div className="page-container">
        {!video || loading ? (
          error ? (
            <ErrorState title="Couldn't load this title" onRetry={() => void refetch()} />
          ) : (
            <LoadingState label="Getting your stream ready…" />
          )
        ) : (
          // The resume point is captured when VideoPlayer mounts. Later progress updates must not reload the iframe.
          <VideoPlayer
            key={episode?.id ?? video.id}
            video={video}
            episode={episode}
            startAt={resumePosition(entry, episode)}
            quality={quality}
            onClose={goBack}
            onProgressUpdate={handleProgressUpdate}
            nextEpisode={nextEpisode}
            autoplayNext={autoplayNext}
            onPlayNext={playNext}
          />
        )}

        {videoWithProgress && (
          <EpisodeList
            key={`${videoWithProgress.id}-${episode?.id ?? ""}`}
            video={videoWithProgress}
            activeEpisodeId={episode?.id}
            onPlay={browser.openPlayer}
          />
        )}

        <CategoryRow eyebrow="Recommendations" title="More Like This">
          {recommendations.map(item => (
            <VideoCard
              key={item.id}
              video={item}
              onSelect={browser.openDetail}
              meta={formatLength(item)}
              aside={<Rating value={item.score} />}
            />
          ))}
        </CategoryRow>
      </div>
    </PageShell>
  );
};

export default WatchRoom;
