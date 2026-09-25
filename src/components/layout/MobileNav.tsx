import { NavLink, useLocation } from "react-router-dom";
import { activeNavPath, NAV_ITEMS } from "@/app/navigation";
import { cn } from "@/lib/utils";

/**
 * Bottom tab bar for phones and small tablets (below the md breakpoint), where the navbar has no room
 * for the section tabs. Same destinations as the navbar, from the shared NAV_ITEMS list.
 */
const MobileNav = () => {
  const { pathname } = useLocation();
  const active = activeNavPath(pathname);

  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto grid h-[var(--mobile-nav-height)] max-w-lg grid-cols-4">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const current = active === path;
          return (
            <li key={path} className="min-w-0">
              <NavLink
                to={path}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 px-0.5 text-[10px] font-medium min-[340px]:text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  current ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="max-w-full truncate">{label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNav;
