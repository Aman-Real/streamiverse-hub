import { ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ThumbnailProps {
  src: string;
  alt: string;
  /** 0-100; draws a watch-progress bar along the bottom edge when above 0. */
  progress?: number;
  className?: string;
  /** Overlays such as badges, positioned by the caller. */
  children?: ReactNode;
}

/** Cover image with an optional progress bar and overlay slot. */
const Thumbnail = ({ src, alt, progress = 0, className, children }: ThumbnailProps) => (
  <div className={cn("relative shrink-0 overflow-hidden rounded-xl bg-muted", className)}>
    <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    {children}
    {progress > 0 && (
      <Progress value={progress} className="absolute inset-x-0 bottom-0 h-1 rounded-none bg-foreground/15" />
    )}
  </div>
);

export default Thumbnail;
