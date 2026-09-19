import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PillTab<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

interface PillTabsProps<T extends string> {
  items: PillTab<T>[];
  value: T;
  onChange: (value: T) => void;
  /** "brand" fills the active pill with the primary colour. */
  tone?: "neutral" | "brand";
  className?: string;
}

/** Segmented pill control shared by the nav links, lounge tabs and filters. */
const PillTabs = <T extends string>({ items, value, onChange, tone = "neutral", className }: PillTabsProps<T>) => (
  <div className={cn("scrollbar-hide flex max-w-full items-center gap-1 overflow-x-auto rounded-full border bg-card/60 p-1", className)}>
    {items.map(({ value: itemValue, label, icon: Icon }) => {
      const active = itemValue === value;
      return (
        <button
          key={itemValue}
          aria-current={active}
          onClick={() => onChange(itemValue)}
          className={cn(
            "flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active && (tone === "brand" ? "bg-primary text-primary-foreground shadow-glow hover:text-primary-foreground" : "bg-secondary text-foreground"),
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </button>
      );
    })}
  </div>
);

export default PillTabs;
