import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import SectionHeader, { type SectionHeaderProps } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoCardSkeleton } from "@/features/catalog/components/VideoCard";
import { cn } from "@/lib/utils";

/** Visible cards per breakpoint; fractions on phones hint that the row scrolls sideways. */
const COLUMNS = {
  3: "[--cols:1.15] sm:[--cols:2] lg:[--cols:3] 2xl:[--cols:4]",
  4: "[--cols:1.4] sm:[--cols:2] lg:[--cols:4] 2xl:[--cols:5]",
  5: "[--cols:2.2] sm:[--cols:3] md:[--cols:4] lg:[--cols:5] 2xl:[--cols:6]",
};

/** Placeholder cards shown while a row loads: enough to fill the widest layout. */
const SKELETON_COUNT = 6;

interface CategoryRowProps extends SectionHeaderProps {
  children: ReactNode;
  columns?: keyof typeof COLUMNS;
  /** Shown between the header and the cards, e.g. genre chips. */
  toolbar?: ReactNode;
  /** Shows placeholder cards until the first titles arrive. */
  loading?: boolean;
  /** Shape of the placeholder cards. */
  skeletonVariant?: "poster" | "landscape";
  /** Keeps the row (and its toolbar) on screen with this message when it has no cards; otherwise it hides. */
  emptyMessage?: string;
}

/**
 * A titled, horizontally scrolling row of cards with left and right buttons on every row. Swipe,
 * trackpad and shift+wheel scroll it too; the buttons page by about one screen width and grey out at
 * either end. An `action` (e.g. "See All") sits next to the buttons. Renders nothing when it has no cards.
 */
const CategoryRow = ({
  children,
  columns = 5,
  action,
  toolbar,
  loading = false,
  skeletonVariant = "poster",
  emptyMessage,
  ...header
}: CategoryRowProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const count = Children.count(children);
  const showSkeletons = loading && count === 0;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    // A pixel of slack absorbs sub-pixel rounding at high zoom levels.
    setEdges({ start: track.scrollLeft <= 1, end: track.scrollLeft >= maxScroll - 1 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    track.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure, count, showSkeletons]);

  const showEmpty = count === 0 && !showSkeletons;
  if (showEmpty && !emptyMessage) return null;

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section>
      <SectionHeader
        {...header}
        action={
          <>
            {action}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" aria-label="Scroll left" disabled={edges.start} onClick={() => scroll(-1)}>
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon" aria-label="Scroll right" disabled={edges.end} onClick={() => scroll(1)}>
                <ChevronRight />
              </Button>
            </div>
          </>
        }
      />
      {toolbar && <div className="mb-4">{toolbar}</div>}
      {showEmpty ? (
        <p className="rounded-2xl border border-dashed py-12 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div ref={trackRef} className={cn("media-row scrollbar-hide", COLUMNS[columns])} aria-busy={showSkeletons}>
          {showSkeletons
            ? Array.from({ length: SKELETON_COUNT }, (_, index) => <VideoCardSkeleton key={index} variant={skeletonVariant} />)
            : children}
        </div>
      )}
    </section>
  );
};

/** A whole placeholder row (heading and cards) for screens whose row titles aren't known until data loads. */
export const CategoryRowSkeleton = ({ columns = 5 }: { columns?: keyof typeof COLUMNS }) => (
  <section aria-hidden>
    <Skeleton className="mb-5 h-7 w-40" />
    <div className={cn("media-row scrollbar-hide", COLUMNS[columns])}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  </section>
);

export default CategoryRow;
