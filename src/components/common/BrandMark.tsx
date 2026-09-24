import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** "sm" is the navbar logo; "lg" is for standalone screens such as sign-in. */
  size?: "sm" | "lg";
  className?: string;
}

const SIZES = {
  sm: { tile: "h-9 w-9 rounded-xl", icon: "h-4 w-4" },
  lg: { tile: "h-12 w-12 rounded-2xl", icon: "h-5 w-5" },
} as const;

/** The gradient play tile used as the Streamix logo. */
const BrandMark = ({ size = "sm", className }: BrandMarkProps) => (
  <span className={cn("grid place-items-center bg-brand-gradient shadow-glow", SIZES[size].tile, className)}>
    <Play className={cn("fill-background text-background", SIZES[size].icon)} />
  </span>
);

export default BrandMark;
