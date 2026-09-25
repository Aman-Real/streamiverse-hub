import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  /** What to do next, e.g. a "Browse titles" button. */
  action?: ReactNode;
  className?: string;
}

/** Placeholder for a list with nothing in it yet: says why it's empty and what to do about it. */
const EmptyState = ({ title, description, icon: Icon, action, className }: EmptyStateProps) => (
  <div className={cn("flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center", className)}>
    {Icon && (
      <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
    )}
    <p className="font-semibold text-foreground">{title}</p>
    {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
    {action && <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div>}
  </div>
);

export default EmptyState;
