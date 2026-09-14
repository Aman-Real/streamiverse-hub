/**
 * Single source of truth for every URL in the app.
 * Never hard-code a path string in a component - import ROUTES instead.
 */
export const ROUTES = {
  home: "/",
  movies: "/movies",
  series: "/series",
  myList: "/my-list",
  profile: "/profile",
  watchHistory: "/watch-history",
  settings: "/settings",
  help: "/help",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
