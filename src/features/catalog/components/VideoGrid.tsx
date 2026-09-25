import { ReactNode } from "react";
import { VideoCardSkeleton } from "@/features/catalog/components/VideoCard";
import { cn } from "@/lib/utils";

interface VideoGridProps {
  children: ReactNode;
  /** Shows placeholder cards instead of the children. */
  loading?: boolean;
  className?: string;
}

const SKELETON_COUNT = 12;

/** Responsive poster grid (2 columns on phones, 3, 4, then 6 on laptops and up), for search results and saved titles. */
const VideoGrid = ({ children, loading = false, className }: VideoGridProps) => (
  <div className={cn("media-grid", className)} aria-busy={loading}>
    {loading ? Array.from({ length: SKELETON_COUNT }, (_, index) => <VideoCardSkeleton key={index} />) : children}
  </div>
);

export default VideoGrid;
