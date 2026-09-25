import { RotateCcw, TriangleAlert } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Shows a "Try again" button that calls this. */
  onRetry?: () => void;
  className?: string;
}

/** Shown when something couldn't load: says so plainly and offers a retry. */
const ErrorState = ({
  title = "Couldn't load this page",
  description = "Check your connection, then try again.",
  onRetry,
  className,
}: ErrorStateProps) => (
  <EmptyState
    icon={TriangleAlert}
    title={title}
    description={description}
    className={className}
    action={
      onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RotateCcw /> Try again
        </Button>
      )
    }
  />
);

export default ErrorState;
