/**
 * Single source of truth for every URL in the app.
 * Never hard-code a path string in a component - import ROUTES instead.
 */
export const ROUTES = {
  home: "/",
  explore: "/explore",
  watch: "/watch",
  movies: "/movies",
  series: "/series",
  myList: "/my-list",
  profile: "/profile",
  watchHistory: "/watch-history",
  settings: "/settings",
  help: "/help",
  auth: "/auth",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** Deep link to one title, e.g. titleRoute(ROUTES.watch, "3") -> "/watch/3". */
export const titleRoute = (route: AppRoute, id: string) => `${route}/${id}`;
