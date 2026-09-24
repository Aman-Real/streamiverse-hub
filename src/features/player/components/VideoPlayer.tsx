import { ArrowLeft, Maximize } from "lucide-react";
import { useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Episode, Video } from "@/features/catalog/types";
import MyListButton from "@/features/my-list/components/MyListButton";
import type { PlaybackPosition, ProgressReportOptions } from "@/features/player/types";
import { getNexStreamEmbedUrl } from "@/lib/nexstream";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  video: Video;
  /** Series: the episode playing. */
  episode?: Episode;
  /** Seconds to resume from the saved Streamix watch-progress entry. */
  startAt?: number;
  onClose: () => void;
  /**
   * Kept in the player contract so the rest of the watch-progress architecture remains
   * compatible. NexStream runs in a cross-origin iframe, so its internal playback time
   * is not exposed to the parent page by the documented API.
   */
  onProgressUpdate: (position: PlaybackPosition, options?: ProgressReportOptions) => void;
}

const VideoPlayer = ({
  video,
  episode,
  startAt = 0,
  onClose,
}: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const streamUrl = useMemo(() => {
    try {
      return getNexStreamEmbedUrl(video, episode, startAt);
    } catch {
      return null;
    }
  }, [video, episode, startAt]);

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
        {streamUrl ? (
          <iframe
            title={`NexStream player for ${video.title}`}
            src={streamUrl}
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
                Check VITE_NEXTSTREAM_API in .env.local, restart the Vite server, and
                make sure your NexStream key is authorized for this domain.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-white/10 bg-background/95 px-4 py-3">
        <Button variant="ghost" size="icon" aria-label="Fullscreen" onClick={toggleFullscreen}>
          <Maximize />
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
