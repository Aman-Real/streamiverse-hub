import { ArrowLeft, Maximize, Minimize } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLAYBACK_CONFIG } from "@/config/playback.config";
import { PLAYER_CONFIG } from "@/config/player.config";
import type { Episode, Video } from "@/features/catalog/types";
import MyListButton from "@/features/my-list/components/MyListButton";
import UpNextCard from "@/features/player/components/UpNextCard";
import type { PlaybackPosition, ProgressReportOptions } from "@/features/player/types";
import { getPlayerEmbedUrl } from "@/lib/playerEmbed";

interface VideoPlayerProps {
  video: Video;
  episode?: Episode;
  /** Seconds to resume from; read once, when the player mounts. */
  startAt?: number;
  /** Stream quality in lines (1080 or 720), from the HD Streaming setting. Read once, when the player mounts. */
  quality: number;
  onClose: () => void;
  onProgressUpdate: (position: PlaybackPosition, options?: ProgressReportOptions) => void;
  /** Series: the episode after this one. An "Up next" card offers it when this one ends. */
  nextEpisode?: Episode;
  /** Start the next episode by itself after a short countdown (the "Autoplay next episode" setting). */
  autoplayNext?: boolean;
  onPlayNext?: (episode: Episode) => void;
}

type PlayerMessage = {
  type?: string;
  currentTime?: number;
  duration?: number;
  position?: number;
  [key: string]: unknown;
};

/** The embedded player in a frame with a title bar (Back, Save) and a status bar (quality, fullscreen). */
const VideoPlayer = ({
  video,
  episode,
  startAt = 0,
  quality,
  onClose,
  onProgressUpdate,
  nextEpisode,
  autoplayNext = false,
  onPlayNext,
}: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ended, setEnded] = useState(false);
  const [upNextDismissed, setUpNextDismissed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const canFullscreen = typeof document !== "undefined" && document.fullscreenEnabled;

  // The resume position and quality are only used when the player is first mounted.
  // Progress updates can cause the parent to re-render; they must not change
  // the iframe URL and restart/reload the player.
  const initialStartAtRef = useRef(startAt);
  const initialQualityRef = useRef(quality);

  const lastPositionRef = useRef<PlaybackPosition>({
    positionSeconds: startAt,
    durationSeconds: 0,
  });

  const embedUrl = useMemo(() => {
    try {
      return getPlayerEmbedUrl(video, episode, { startAt: initialStartAtRef.current, quality: initialQualityRef.current });
    } catch {
      return null;
    }
  }, [video, episode]);

  useEffect(() => {
    const { events } = PLAYER_CONFIG;
    const handleMessage = (event: MessageEvent<PlayerMessage>) => {
      if (event.origin !== PLAYER_CONFIG.origin) return;

      const message = event.data;
      if (!message || typeof message.type !== "string") return;

      if (message.type === events.error) {
        console.error("[Player] Playback error:", message);
        return;
      }

      const currentTime = Number(message.currentTime ?? message.position);
      const duration = Number(message.duration);
      const knownDuration = Number.isFinite(duration) && duration > 0 ? duration : lastPositionRef.current.durationSeconds;

      if (message.type === events.ended) {
        const next: PlaybackPosition = {
          positionSeconds: Number.isFinite(currentTime) ? Math.max(0, currentTime) : knownDuration,
          durationSeconds: knownDuration,
        };
        lastPositionRef.current = next;
        onProgressUpdate(next, { immediate: true });
        setEnded(true);
        return;
      }

      if ((message.type === events.timeupdate || message.type === events.pause) && Number.isFinite(currentTime)) {
        const next: PlaybackPosition = { positionSeconds: Math.max(0, currentTime), durationSeconds: knownDuration };
        lastPositionRef.current = next;
        // Some streams never send "ended"; reaching the last second counts as ending.
        const reachedEnd = knownDuration > 0 && currentTime >= knownDuration - PLAYBACK_CONFIG.endedToleranceSeconds;
        onProgressUpdate(next, { immediate: message.type === events.pause || reachedEnd });
        setEnded(reachedEnd);
        // Rewinding after the end brings the "Up next" card back the next time the episode ends.
        if (!reachedEnd) setUpNextDismissed(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onProgressUpdate]);

  useEffect(() => {
    const saveOnExit = () => {
      const position = lastPositionRef.current;
      if (position.positionSeconds > 0) {
        onProgressUpdate(position, { immediate: true });
      }
    };

    window.addEventListener("pagehide", saveOnExit);
    return () => window.removeEventListener("pagehide", saveOnExit);
  }, [onProgressUpdate]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void containerRef.current?.requestFullscreen?.();
  };

  const playNext = useCallback(() => {
    if (nextEpisode) onPlayNext?.(nextEpisode);
  }, [nextEpisode, onPlayNext]);

  const showUpNext = ended && !upNextDismissed && Boolean(nextEpisode && onPlayNext);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border bg-black shadow-2xl sm:rounded-3xl [&:fullscreen]:flex [&:fullscreen]:flex-col [&:fullscreen]:rounded-none"
    >
      <div className="flex items-center gap-3 border-b border-white/10 bg-background/95 px-3 py-3 sm:gap-4 md:px-6">
        <Button variant="outline" size="sm" onClick={onClose} className="shrink-0 px-3 sm:px-4" aria-label="Back">
          <ArrowLeft />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="min-w-0 flex-1 border-l pl-3 sm:pl-4">
          <p className="truncate text-sm font-medium text-foreground sm:text-base md:text-lg">{video.title}</p>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {episode ? `S${episode.season}:E${episode.number} · ${episode.title}` : `${video.genre} · ${video.year}`}
          </p>
        </div>

        <div className="hidden shrink-0 gap-2 md:flex">
          {video.formats.map(format => (
            <Badge key={format} variant="glass" className="py-1">
              {format}
            </Badge>
          ))}
        </div>

        <MyListButton video={video} className="shrink-0" />
      </div>

      <div className="relative aspect-video w-full bg-black [:fullscreen_&]:flex-1">
        {embedUrl ? (
          <iframe
            title={`Player for ${video.title}`}
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-2">
              <p className="text-lg font-semibold text-white">Playback is unavailable</p>
              <p className="text-sm text-white/70">
                This title does not contain a valid TMDB identifier or a TV episode was not selected.
              </p>
            </div>
          </div>
        )}
        {showUpNext && nextEpisode && (
          <UpNextCard
            episode={nextEpisode}
            autoplay={autoplayNext}
            seconds={PLAYBACK_CONFIG.upNextCountdownSeconds}
            onPlay={playNext}
            onCancel={() => setUpNextDismissed(true)}
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-background/95 px-3 py-2 sm:px-4 sm:py-3">
        <p className="min-w-0 truncate text-xs text-muted-foreground">
          Quality: {initialQualityRef.current}p{initialQualityRef.current >= PLAYBACK_CONFIG.quality.hd ? " (HD)" : ""}
          {" · "}
          <Link to={ROUTES.settings} className="text-primary-soft hover:underline">
            Change in Settings
          </Link>
        </p>
        {canFullscreen && (
          <Button variant="ghost" size="icon" aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen}>
            {fullscreen ? <Minimize /> : <Maximize />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
