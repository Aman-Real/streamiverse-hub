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

/** Deep link to one title, e.g. titleRoute(ROUTES.explore, "movie-603") -> "/explore/movie-603". */
export const titleRoute = (route: AppRoute, id: string) => `${route}/${id}`;

/** Query param that carries the search box's text, e.g. "/?q=dune". */
export const SEARCH_PARAM = "q";

/** A route with a search query attached, e.g. searchRoute(ROUTES.home, "dune") -> "/?q=dune". */
export const searchRoute = (route: AppRoute, query: string) => {
  const trimmed = query.trim();
  return trimmed ? `${route}?${new URLSearchParams({ [SEARCH_PARAM]: query })}` : route;
};

/** Query params the Watch Room reads to pick a series episode. */
export const WATCH_PARAMS = { season: "season", episode: "episode" } as const;

/** A series episode named in a Watch Room URL. */
export interface EpisodeRef {
  season: number;
  episode: number;
}

/** Link that starts playback, e.g. watchRoute("tv-1399", { season: 2, episode: 5 }) -> "/watch/tv-1399?season=2&episode=5". */
export const watchRoute = (id: string, episode?: EpisodeRef) => {
  const path = titleRoute(ROUTES.watch, id);
  if (!episode) return path;
  const params = new URLSearchParams({
    [WATCH_PARAMS.season]: String(episode.season),
    [WATCH_PARAMS.episode]: String(episode.episode),
  });
  return `${path}?${params}`;
};

/** The episode named in Watch Room params; null when missing or not positive whole numbers. */
export const parseEpisodeRef = (params: URLSearchParams): EpisodeRef | null => {
  const season = Number(params.get(WATCH_PARAMS.season));
  const episode = Number(params.get(WATCH_PARAMS.episode));
  return Number.isInteger(season) && Number.isInteger(episode) && season > 0 && episode > 0 ? { season, episode } : null;
};
