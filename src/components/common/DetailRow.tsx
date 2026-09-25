import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DetailRowProps {
  title: ReactNode;
  /** The current value or a one-line explanation, under the title. */
  description?: ReactNode;
  /** Right-aligned control: a switch, a badge, an edit button. */
  action?: ReactNode;
  /** Extra content under the title row, e.g. an inline error. */
  children?: ReactNode;
  /** "card" stands alone with its own border; "plain" sits inside a SectionPanel. */
  variant?: "card" | "plain";
  className?: string;
}

/** A labelled row with an optional control on the right. Profile fields and settings are all built from it. */
const DetailRow = ({ title, description, action, children, variant = "card", className }: DetailRowProps) => (
  <div className={cn(variant === "card" && "rounded-2xl border bg-card p-4 sm:p-5", className)}>
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description && <div className="mt-0.5 break-words text-sm text-muted-foreground">{description}</div>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
    {children}
  </div>
);

export default DetailRow;
