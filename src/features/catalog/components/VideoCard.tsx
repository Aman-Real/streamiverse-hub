import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Thumbnail from "@/features/catalog/components/Thumbnail";
import type { Video } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

type VideoCardVariant = "poster" | "landscape";

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  /** "landscape" is the continue-watching style, with a progress bar. */
  variant?: VideoCardVariant;
  meta?: ReactNode;
  /** Absolutely positioned overlay on the image, e.g. a match badge. */
  overlay?: ReactNode;
  /** Right of the title, e.g. a rating or a menu. */
  aside?: ReactNode;
  footer?: ReactNode;
}

const IMAGE_SHAPES: Record<VideoCardVariant, string> = { poster: "aspect-[2/3]", landscape: "aspect-video" };

/**
 * The one title card used everywhere. On hover (mouse or trackpad) it grows slightly and lights up in the
 * theme colour; keyboard focus gets the same highlight. Enter or Space opens it.
 */
const VideoCard = ({ video, onSelect, variant = "poster", meta, overlay, aside, footer }: VideoCardProps) => {
  const landscape = variant === "landscape";

  return (
    <article
      tabIndex={0}
      role="link"
      aria-label={video.title}
      onClick={() => onSelect(video)}
      onKeyDown={event => {
        if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        onSelect(video);
      }}
      className="card-lift group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card"
    >
      <Thumbnail
        // Landscape cards use the wide backdrop; a cropped portrait poster reads badly at 16:9.
        src={landscape ? video.backdrop ?? video.thumbnail : video.thumbnail}
        alt={video.title}
        progress={landscape ? video.progress : 0}
        className={cn("rounded-none", IMAGE_SHAPES[variant])}
      >
        {overlay}
      </Thumbnail>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="card-lift-title truncate text-sm font-medium text-foreground transition-colors">{video.title}</h3>
            {meta && <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta}</p>}
          </div>
          {aside}
        </div>
        {footer}
      </div>
    </article>
  );
};

/** Placeholder with the same shape as a VideoCard, shown while a row loads. */
export const VideoCardSkeleton = ({ variant = "poster" }: { variant?: VideoCardVariant }) => (
  <div aria-hidden className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card">
    <Skeleton className={cn("rounded-none", IMAGE_SHAPES[variant])} />
    <div className="space-y-2 p-3 sm:p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export default VideoCard;
