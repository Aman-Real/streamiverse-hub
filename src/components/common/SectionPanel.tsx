import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionPanelProps {
  title: string;
  icon?: LucideIcon;
  /** One line under the title. */
  description?: ReactNode;
  /** Usually DetailRows with variant="plain"; they're separated by dividers automatically. */
  children: ReactNode;
  className?: string;
}

/** A bordered card that groups related rows under one heading, e.g. a settings section. */
const SectionPanel = ({ title, icon: Icon, description, children, className }: SectionPanelProps) => (
  <section className={cn("rounded-2xl border bg-card p-5 sm:p-6", className)}>
    <div className="mb-2 space-y-1">
      <h2 className="flex items-center gap-2 font-semibold text-foreground">
        {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden />}
        {title}
      </h2>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
    <div className="divide-y [&>*]:py-4 [&>*:last-child]:pb-0">{children}</div>
  </section>
);

export default SectionPanel;
