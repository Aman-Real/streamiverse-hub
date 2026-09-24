import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export interface SectionHeaderProps {
  title: string;
  /** Small kicker above the title, e.g. "Episodes". */
  eyebrow?: string;
  /** Pill next to the title, e.g. "4 in progress". */
  count?: string;
  icon?: ReactNode;
  /** Right-aligned slot: links, arrows, filters. */
  action?: ReactNode;
}

const SectionHeader = ({ title, eyebrow, count, icon, action }: SectionHeaderProps) => (
  <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
    <div>
      {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{title}</h2>
        {count && <Badge variant="secondary" className="font-medium text-muted-foreground">{count}</Badge>}
      </div>
    </div>
    {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
  </div>
);

/** "See All ›" link for a section header's action slot. */
export const SectionLink = ({ to, label = "See All" }: { to: string; label?: string }) => (
  <Link to={to} className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
    {label} <ChevronRight className="h-3.5 w-3.5" />
  </Link>
);

export default SectionHeader;
