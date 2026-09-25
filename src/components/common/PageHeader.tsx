import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  /** Icon shown before the title, in the theme colour. */
  icon?: LucideIcon;
  /** One line under the title saying what the page is for. */
  description?: ReactNode;
  /** Right-aligned slot, e.g. a "Clear all" button. Wraps below the title on narrow screens. */
  action?: ReactNode;
  className?: string;
}

/** The title block at the top of a page. Every screen uses it, so page titles look the same everywhere. */
const PageHeader = ({ title, icon: Icon, description, action, className }: PageHeaderProps) => (
  <header className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
    <div className="min-w-0 space-y-1.5">
      <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {Icon && <Icon className="h-7 w-7 shrink-0 text-primary sm:h-8 sm:w-8" aria-hidden />}
        <span className="min-w-0 break-words">{title}</span>
      </h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
  </header>
);

export default PageHeader;
