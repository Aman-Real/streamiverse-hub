import { useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { parseEpisodeRef } from "@/app/routes";
import PageShell from "@/components/layout/PageShell";
import { NO_VIDEOS, useTitle, useTrending } from "@/features/catalog/hooks/useCatalogQueries";
import VideoPlayer from "@/features/player/components/VideoPlayer";
import { useWatchProgress } from "@/features/watch-progress/hooks/useWatchProgress";
import { resolveEpisode, resumePosition } from "@/features/watch-progress/utils/progress";
import type { PlaybackPosition, ProgressReportOptions } from "@/features/player/types";
import { isTmdbNotFound } from "@/lib/tmdb";
import NotFound from "@/pages/NotFound";

/**
 * Plays /watch/:id from where the viewer stopped. Series play the episode in ?season=&episode=, else the one
 * in progress. Without an id it resumes the latest in-progress title, else the top trending one.
 */
const WatchRoom = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loading, continueWatching, getProgress, saveProgress } = useWatchProgress();
  const { data: trending = NO_VIDEOS } = useTrending(!id);
  // Without an id, wait for progress so playback doesn't start one title and then switch to another.
  const titleId = id ?? (loading ? undefined : continueWatching[0]?.id ?? trending[0]?.id);
  const { data, error } = useTitle(titleId);

  const video = data?.video;
  const entry = titleId ? getProgress(titleId) : undefined;
  const episode = video ? resolveEpisode(video, parseEpisodeRef(searchParams), entry) : undefined;

  const handleProgressUpdate = useCallback(
    (position: PlaybackPosition, options?: ProgressReportOptions) => {
      if (!video) return;
      saveProgress(video, position, { ...options, episode });
    },
    [video, episode, saveProgress],
  );

  if (isTmdbNotFound(error)) return <NotFound />;

  return (
    <PageShell withFooter>
      <div className="page-container">
        {/* The resume point is captured when VideoPlayer mounts. Later progress updates must not reload the iframe. */}
        {video && !loading && (
          <VideoPlayer
            key={episode?.id ?? video.id}
            video={video}
            episode={episode}
            startAt={resumePosition(entry, episode)}
            onClose={() => navigate(-1)}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </div>
    </PageShell>
  );
};

export default WatchRoom;
