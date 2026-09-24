import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import PageFooter from "@/components/layout/PageFooter";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  /** Wire this to a search handler on pages where search does something. */
  onSearch?: (query: string) => void;
  /** Extra classes for the page root, e.g. "text-foreground". */
  className?: string;
  withFooter?: boolean;
}

/**
 * Page chrome shared by every route: background, navbar, optional footer.
 * Page-specific padding stays in the page so each screen's layout is explicit.
 */
const PageShell = ({
  children,
  onSearch = () => {},
  className,
  withFooter = false,
}: PageShellProps) => (
  <div className={cn("min-h-screen bg-background", className)}>
    <Navbar onSearch={onSearch} />
    {children}
    {withFooter && <PageFooter />}
  </div>
);

export default PageShell;
