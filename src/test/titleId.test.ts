import { describe, expect, it } from "vitest";
import { parseEpisodeRef, watchRoute } from "@/app/routes";
import { parseTitleId, toEpisodeId, toTitleId } from "@/features/catalog/utils/titleId";

describe("title ids", () => {
  it("round-trips movies and series", () => {
    expect(toTitleId("movie", 603)).toBe("movie-603");
    expect(toTitleId("series", 1399)).toBe("tv-1399");
    expect(parseTitleId("movie-603")).toEqual({ type: "movie", tmdbId: 603 });
    expect(parseTitleId("tv-1399")).toEqual({ type: "series", tmdbId: 1399 });
  });

  it("rejects malformed ids", () => {
    expect(parseTitleId("3")).toBeNull();
    expect(parseTitleId("tv-abc")).toBeNull();
    expect(parseTitleId("movie-603/extra")).toBeNull();
  });

  it("builds episode ids", () => {
    expect(toEpisodeId("tv-1399", 2, 5)).toBe("tv-1399-s2e5");
  });
});

describe("watch links", () => {
  it("adds the episode as query params", () => {
    expect(watchRoute("movie-603")).toBe("/watch/movie-603");
    expect(watchRoute("tv-1399", { season: 2, episode: 5 })).toBe("/watch/tv-1399?season=2&episode=5");
  });

  it("reads only valid episode params", () => {
    expect(parseEpisodeRef(new URLSearchParams("season=2&episode=5"))).toEqual({ season: 2, episode: 5 });
    expect(parseEpisodeRef(new URLSearchParams(""))).toBeNull();
    expect(parseEpisodeRef(new URLSearchParams("season=2"))).toBeNull();
    expect(parseEpisodeRef(new URLSearchParams("season=1.5&episode=2"))).toBeNull();
  });
});
