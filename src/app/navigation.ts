import { Clapperboard, Compass, House, Sofa, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/app/routes";

/** One main destination, shown in the navbar tabs (tablet and up) and the bottom tab bar (phones). */
export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

/** The app's main sections, in display order. Both navigation bars read this list, so they never disagree. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", path: ROUTES.home, icon: House },
  { label: "Explore", path: ROUTES.explore, icon: Compass },
  { label: "Watch Room", path: ROUTES.watch, icon: Clapperboard },
  { label: "My Lounge", path: ROUTES.myList, icon: Sofa },
];

/** The nav item a path belongs to, including deep links such as /explore/movie-603; "" when none. */
export const activeNavPath = (pathname: string) =>
  NAV_ITEMS.find(({ path }) => (path === ROUTES.home ? pathname === path : pathname === path || pathname.startsWith(`${path}/`)))
    ?.path ?? "";
