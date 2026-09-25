import { ReactNode } from "react";
import MobileNav from "@/components/layout/MobileNav";
import Navbar from "@/components/layout/Navbar";
import PageFooter from "@/components/layout/PageFooter";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  /**
   * True on pages that filter their own content with the navbar search (Home, Movies, Series, My Lounge).
   * Elsewhere, typing in the search box jumps to Home's search results.
   */
  searchable?: boolean;
  /** Extra classes for the page root, e.g. "text-foreground". */
  className?: string;
  withFooter?: boolean;
}

/**
 * Page chrome shared by every route: background, navbar, optional footer, and the bottom tab bar on phones.
 * Page-specific padding stays in the page so each screen's layout is explicit.
 */
const PageShell = ({ children, searchable = false, className, withFooter = false }: PageShellProps) => (
  <div className={cn("pb-mobile-nav min-h-screen bg-background", className)}>
    <Navbar searchable={searchable} />
    {children}
    {withFooter && <PageFooter />}
    <MobileNav />
  </div>
);

export default PageShell;
