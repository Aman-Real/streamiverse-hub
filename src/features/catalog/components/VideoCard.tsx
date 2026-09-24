import { ReactNode } from "react";
import Thumbnail from "@/features/catalog/components/Thumbnail";
import type { Video } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  /** "landscape" is the continue-watching style, with a progress bar. */
  variant?: "poster" | "landscape";
  meta?: ReactNode;
  /** Absolutely positioned overlay on the image, e.g. a match badge. */
  overlay?: ReactNode;
  /** Right of the title, e.g. a rating or a menu. */
  aside?: ReactNode;
  footer?: ReactNode;
}

const VideoCard = ({ video, onSelect, variant = "poster", meta, overlay, aside, footer }: VideoCardProps) => {
  const landscape = variant === "landscape";

  return (
    <article
      tabIndex={0}
      onClick={() => onSelect(video)}
      onKeyDown={event => event.key === "Enter" && event.target === event.currentTarget && onSelect(video)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Thumbnail
        // Landscape cards use the wide backdrop; a cropped portrait poster reads badly at 16:9.
        src={landscape ? video.backdrop ?? video.thumbnail : video.thumbnail}
        alt={video.title}
        progress={landscape ? video.progress : 0}
        className={cn("rounded-none", landscape ? "aspect-video" : "aspect-[2/3]")}
      >
        {overlay}
      </Thumbnail>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-foreground">{video.title}</h3>
            {meta && <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta}</p>}
          </div>
          {aside}
        </div>
        {footer}
      </div>
    </article>
  );
};

export default VideoCard;
