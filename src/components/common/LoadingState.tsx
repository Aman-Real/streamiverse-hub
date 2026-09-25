import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  /** Read by screen readers and shown next to the spinner. */
  label?: string;
  className?: string;
}

/** Centered spinner for a screen or panel that is still loading. */
const LoadingState = ({ label = "Loading…", className }: LoadingStateProps) => (
  <div role="status" className={cn("flex min-h-[40vh] items-center justify-center gap-3 text-sm text-muted-foreground", className)}>
    <LoaderCircle className="h-5 w-5 animate-spin text-primary" aria-hidden />
    {label}
  </div>
);

export default LoadingState;
