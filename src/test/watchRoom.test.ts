import { describe, expect, it } from "vitest";
import { searchRoute } from "@/app/routes";
import { activeNavPath } from "@/app/navigation";
import { getCopyrightYear } from "@/config/app.config";
import { CATALOG_CONFIG } from "@/config/catalog.config";
import { pickTrailerKey } from "@/features/catalog/api/tmdb.mappers";
import type { Episode, Video } from "@/features/catalog/types";
import { dedupeCategories, favouriteGenreOption, getNextEpisode, interleave } from "@/features/catalog/utils/catalog";
import { readPlaybackSettings, streamQuality } from "@/features/settings/utils/playbackSettings";
import type { ProgressEntry } from "@/features/watch-progress/types";
import { planWatchRoom, resolveEpisode } from "@/features/watch-progress/utils/progress";
import { getPlayerEmbedUrl } from "@/lib/playerEmbed";
import { PLAYER_CONFIG } from "@/config/player.config";

const episode = (season: number, number: number): Episode => ({
  id: `tv-1-s${season}e${number}`,
  season,
  number,
  title: `Episode ${number}`,
  description: "",
  runtime: 50,
  airDate: "",
  format: "HD",
  progress: 0,
  thumbnail: "",
});

const video = (id: string, overrides: Partial<Video> = {}): Video => ({
  id,
  title: id,
  description: "",
  thumbnail: "",
  runtime: 0,
  genre: "Drama",
  year: 2024,
  rating: "NR",
  score: 8,
  match: 80,
  formats: ["HD"],
  progress: 0,
  videoUrl: "",
  type: id.startsWith("tv") ? "series" : "movie",
  ...overrides,
});

const series = video("tv-1", { episodes: [episode(1, 1), episode(1, 2), episode(2, 1)] });

const entry = (overrides: Partial<ProgressEntry> = {}): ProgressEntry => ({
  title: { ...series, episodes: undefined } as ProgressEntry["title"],
  progress: 40,
  positionSeconds: 1200,
  durationSeconds: 3000,
  season: 1,
  episode: 2,
  episodeTitle: "Episode 2",
  updatedAt: null,
  ...overrides,
});

describe("next episode", () => {
  it("moves through a season, then into the next one, and stops after the last", () => {
    expect(getNextEpisode(series, { season: 1, episode: 1 })?.id).toBe("tv-1-s1e2");
    expect(getNextEpisode(series, { season: 1, episode: 2 })?.id).toBe("tv-1-s2e1");
    expect(getNextEpisode(series, { season: 2, episode: 1 })).toBeUndefined();
  });

  it("continues after a finished episode when no episode is requested", () => {
    expect(resolveEpisode(series, null, entry({ progress: 100 }))?.id).toBe("tv-1-s2e1");
    expect(resolveEpisode(series, null, entry({ progress: 100, season: 2, episode: 1 }))?.id).toBe("tv-1-s2e1");
    expect(resolveEpisode(series, { season: 1, episode: 1 }, entry({ progress: 100 }))?.id).toBe("tv-1-s1e1");
  });
});

describe("Watch Room button", () => {
  it("suggests the latest titles to new viewers", () => {
    expect(planWatchRoom(undefined, undefined)).toEqual({ kind: "discover" });
  });

  it("resumes an unfinished movie or episode", () => {
    expect(planWatchRoom(entry(), undefined)).toEqual({ kind: "play", titleId: "tv-1" });
    const movie = entry({ title: { ...video("movie-7") } as ProgressEntry["title"], season: null, episode: null });
    expect(planWatchRoom(movie, undefined)).toEqual({ kind: "play", titleId: "movie-7" });
  });

  it("suggests related movies after a finished movie", () => {
    const movie = entry({ title: { ...video("movie-7") } as ProgressEntry["title"], season: null, episode: null, progress: 100 });
    expect(planWatchRoom(movie, undefined)).toEqual({ kind: "finished", titleId: "movie-7" });
  });

  it("plays the next episode after a finished one, and suggests related series after the last", () => {
    expect(planWatchRoom(entry({ progress: 100 }), undefined)).toEqual({ kind: "loading" });
    expect(planWatchRoom(entry({ progress: 100 }), series)).toEqual({
      kind: "play",
      titleId: "tv-1",
      episode: { season: 2, episode: 1 },
    });
    expect(planWatchRoom(entry({ progress: 100, season: 2, episode: 1 }), series)).toEqual({ kind: "finished", titleId: "tv-1" });
    expect(planWatchRoom(entry({ progress: 100 }), undefined, true)).toEqual({ kind: "finished", titleId: "tv-1" });
  });
});

describe("rows", () => {
  it("interleaves lists without repeating a title", () => {
    const merged = interleave([[video("movie-1"), video("movie-2")], [video("tv-1"), video("movie-1"), video("tv-2")]]);
    expect(merged.map(item => item.id)).toEqual(["movie-1", "tv-1", "movie-2", "tv-2"]);
  });

  it("shows each title in one row only and drops rows left empty", () => {
    const rows = dedupeCategories([
      { name: "A", items: [video("tv-1"), video("tv-2")] },
      { name: "B", items: [video("tv-2")] },
      { name: "C", items: [video("tv-2"), video("tv-3")] },
    ]);
    expect(rows.map(row => [row.name, row.items.map(item => item.id)])).toEqual([
      ["A", ["tv-1", "tv-2"]],
      ["C", ["tv-3"]],
    ]);
  });

  it("guesses the favourite genre from history, including series genre names", () => {
    const options = CATALOG_CONFIG.genreOptions;
    const history = [video("tv-1", { genre: "Action & Adventure" }), video("movie-1", { genre: "Action" }), video("movie-2", { genre: "Horror" })];
    expect(favouriteGenreOption(options, history)?.id).toBe("action");
    expect(favouriteGenreOption(options, [video("movie-3", { genre: "Other" })])).toBeUndefined();
  });
});

describe("playback settings", () => {
  it("fills in defaults for missing or malformed values", () => {
    expect(readPlaybackSettings(null)).toEqual({ autoplayNext: true, hdStreaming: true });
    expect(readPlaybackSettings({ autoplayNext: false, hdStreaming: "yes" })).toEqual({ autoplayNext: false, hdStreaming: true });
  });

  it("streams 1080p with HD on and 720p with it off", () => {
    expect(streamQuality({ hdStreaming: true })).toBe(1080);
    expect(streamQuality({ hdStreaming: false })).toBe(720);
    expect(getPlayerEmbedUrl(video("movie-603"), undefined, { quality: 720 })).toContain("quality=720");
    expect(getPlayerEmbedUrl(series, episode(2, 1), { quality: 1080, startAt: 61.8 })).toBe(
      `${PLAYER_CONFIG.embedBaseUrl}/tv/1?s=2&e=1&quality=1080&autoplay=true&continueprompt=false&autonext=false&t=61`,
    );
  });
});

describe("small helpers", () => {
  it("picks the official trailer first", () => {
    expect(
      pickTrailerKey({
        results: [
          { key: "teaser", site: "YouTube", type: "Teaser" },
          { key: "fan", site: "YouTube", type: "Trailer", official: false },
          { key: "official", site: "YouTube", type: "Trailer", official: true },
          { key: "vimeo", site: "Vimeo", type: "Trailer", official: true },
        ],
      }),
    ).toBe("official");
    expect(pickTrailerKey({ results: [{ key: "teaser", site: "YouTube", type: "Teaser" }] })).toBe("teaser");
    expect(pickTrailerKey(undefined)).toBeUndefined();
  });

  it("keeps the footer year current", () => {
    expect(getCopyrightYear(new Date("2031-03-01T12:00:00Z"))).toBe(2031);
  });

  it("builds search links and finds the active nav item", () => {
    expect(searchRoute("/", "dune part two")).toBe("/?q=dune+part+two");
    expect(searchRoute("/", "   ")).toBe("/");
    expect(activeNavPath("/")).toBe("/");
    expect(activeNavPath("/watch/tv-1")).toBe("/watch");
    expect(activeNavPath("/explore")).toBe("/explore");
    expect(activeNavPath("/settings")).toBe("");
  });
});
