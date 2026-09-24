import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, ReactNode, useRef } from "react";
import SectionHeader, { type SectionHeaderProps } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Visible cards per breakpoint; fractions on mobile hint that the row scrolls. */
const COLUMNS = {
  3: "[--cols:1.15] sm:[--cols:2] lg:[--cols:3]",
  4: "[--cols:1.4] sm:[--cols:2] lg:[--cols:4]",
  5: "[--cols:2.2] sm:[--cols:3] lg:[--cols:5]",
};

interface CategoryRowProps extends SectionHeaderProps {
  children: ReactNode;
  columns?: keyof typeof COLUMNS;
}

/** A titled, horizontally scrolling row of cards. Without an `action` it shows scroll arrows. */
const CategoryRow = ({ children, columns = 5, action, ...header }: CategoryRowProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  if (Children.count(children) === 0) return null;

  const scroll = (direction: number) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  };

  return (
    <section>
      <SectionHeader
        {...header}
        action={action ?? (
          <>
            <Button variant="outline" size="icon" aria-label="Scroll left" onClick={() => scroll(-1)}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" aria-label="Scroll right" onClick={() => scroll(1)}><ChevronRight /></Button>
          </>
        )}
      />
      <div ref={trackRef} className={cn("media-row scrollbar-hide", COLUMNS[columns])}>
        {children}
      </div>
    </section>
  );
};

export default CategoryRow;
