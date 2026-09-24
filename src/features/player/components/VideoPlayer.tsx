import { ArrowLeft, Maximize } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Episode, Video } from "@/features/catalog/types";
import MyListButton from "@/features/my-list/components/MyListButton";
import type { PlaybackPosition, ProgressReportOptions } from "@/features/player/types";
import { getCineSrcEmbedUrl } from "@/lib/cinesrc";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  video: Video;
  episode?: Episode;
  startAt?: number;
  onClose: () => void;
  onProgressUpdate: (position: PlaybackPosition, options?: ProgressReportOptions) => void;
}

type CineSrcMessage = {
  type?: string;
  currentTime?: number;
  duration?: number;
  position?: number;
  [key: string]: unknown;
};

const CineSrcPlayer = ({
  video,
  episode,
  startAt = 0,
  onClose,
  onProgressUpdate,
}: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // The resume position is only used when the player is first mounted.
  // Progress updates can cause the parent to re-render; they must not change
  // the iframe URL and restart/reload the CineSrc player.
  const initialStartAtRef = useRef(startAt);

  const lastPositionRef = useRef<PlaybackPosition>({
    positionSeconds: startAt,
    durationSeconds: 0,
  });

  const cinesrcUrl = useMemo(() => {
    try {
      return getCineSrcEmbedUrl(video, episode, initialStartAtRef.current);
    } catch {
      return null;
    }
  }, [video, episode]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<CineSrcMessage>) => {
      if (event.origin !== "https://cinesrc.st") return;

      const message = event.data;
      if (!message || typeof message.type !== "string") return;

      // Keep this logging while diagnosing source/provider playback failures.
      // It can be removed after the player is confirmed stable.
      if (
        message.type === "cinesrc:error" ||
        message.type === "cinesrc:sourceused" ||
        message.type === "cinesrc:ready" ||
        message.type === "cinesrc:play" ||
        message.type === "cinesrc:pause" ||
        message.type === "cinesrc:ended"
      ) {
        console.info("[CineSrc]", message.type, message);
      }

      if (message.type === "cinesrc:error") {
        console.error("[CineSrc] Playback error:", message);
        return;
      }

      const currentTime = Number(message.currentTime ?? message.position);
      const duration = Number(message.duration);

      if (message.type === "cinesrc:timeupdate" && Number.isFinite(currentTime)) {
        const next: PlaybackPosition = {
          positionSeconds: Math.max(0, currentTime),
          durationSeconds:
            Number.isFinite(duration) && duration > 0
              ? duration
              : lastPositionRef.current.durationSeconds,
        };

        lastPositionRef.current = next;
        onProgressUpdate(next);
      }

      if (
        (message.type === "cinesrc:pause" || message.type === "cinesrc:ended") &&
        Number.isFinite(currentTime)
      ) {
        const next: PlaybackPosition = {
          positionSeconds: Math.max(0, currentTime),
          durationSeconds:
            Number.isFinite(duration) && duration > 0
              ? duration
              : lastPositionRef.current.durationSeconds,
        };

        lastPositionRef.current = next;
        onProgressUpdate(next, { immediate: true });
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

  const toggleFullscreen = () => {
    void containerRef.current?.requestFullscreen?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl border bg-black shadow-2xl"
    >
      <div className="flex items-center gap-4 border-b border-white/10 bg-background/95 px-4 py-3 md:px-6">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ArrowLeft />
          Back
        </Button>

        <p className="min-w-0 truncate border-l pl-4 text-base font-medium text-foreground md:text-lg">
          {video.title}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {episode
              ? `S${episode.season}:E${episode.number} · ${episode.title}`
              : `${video.genre} · ${video.year}`}
          </span>
        </p>

        <div className="ml-auto hidden gap-2 md:flex">
          {video.formats.map(format => (
            <Badge key={format} variant="glass" className="py-1">
              {format}
            </Badge>
          ))}
        </div>

        <MyListButton video={video} className="ml-auto md:ml-0" />
      </div>

      <div className="relative aspect-video min-h-[20rem] bg-black">
        {cinesrcUrl ? (
          <iframe
            title={`CineSrc player for ${video.title}`}
            src={cinesrcUrl}
            className={cn("absolute inset-0 h-full w-full border-0")}
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
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-background/95 px-4 py-3">
        <div className="text-xs text-muted-foreground">Player: CineSrc · Preferred quality: 1080p</div>
        <Button variant="ghost" size="icon" aria-label="Fullscreen" onClick={toggleFullscreen}>
          <Maximize />
        </Button>
      </div>
    </div>
  );
};

export default CineSrcPlayer;
