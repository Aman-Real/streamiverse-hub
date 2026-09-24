import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  /** Score out of 10. */
  value: number;
  className?: string;
}

/** Star score, e.g. "★ 8.9". */
const Rating = ({ value, className }: RatingProps) => (
  <span className={cn("inline-flex shrink-0 items-center gap-1 text-xs font-medium text-foreground", className)}>
    <Star className="h-3 w-3 fill-current text-rating" />
    {value.toFixed(1)}
  </span>
);

export default Rating;
