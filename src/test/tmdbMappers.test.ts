import { describe, expect, it } from "vitest";
import { mapMultiResults, mapSummaries, mapTvDetail } from "@/features/catalog/api/tmdb.mappers";
import type { TmdbMultiResult, TmdbTvDetail, TmdbTvSummary } from "@/features/catalog/api/tmdb.types";
import { formatLength } from "@/features/catalog/utils/catalog";

const genres = new Map([
  [878, "Science Fiction"],
  [18, "Drama"],
]);

const series: TmdbTvSummary = {
  id: 1399,
  name: "Game of Thrones",
  overview: "Seven noble families fight for control.",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  vote_average: 8.456,
  vote_count: 20000,
  first_air_date: "2011-04-17",
  genre_ids: [18],
};

describe("tmdb mappers", () => {
  it("maps list results to cards", () => {
    const [video] = mapSummaries([series], genres);
    expect(video).toMatchObject({
      id: "tv-1399",
      type: "series",
      title: "Game of Thrones",
      genre: "Drama",
      year: 2011,
      score: 8.5,
      match: 85,
      rating: "NR",
    });
    expect(video.thumbnail).toBe("https://image.tmdb.org/t/p/w342/poster.jpg");
    expect(formatLength(video)).toBe("Series");
  });

  it("drops people and stubs without a poster or date, and shortens long genre names", () => {
    const results: TmdbMultiResult[] = [
      { media_type: "person", id: 1 },
      { ...series, media_type: "tv", poster_path: null },
      {
        media_type: "movie",
        id: 603,
        title: "The Matrix",
        overview: "",
        poster_path: "/m.jpg",
        backdrop_path: null,
        vote_average: 8.2,
        vote_count: 25000,
        release_date: "1999-03-31",
        genre_ids: [878],
      },
    ];
    const videos = mapMultiResults(results, genres);
    expect(videos.map(video => video.id)).toEqual(["movie-603"]);
    expect(videos[0].genre).toBe("Sci-Fi");
    expect(videos[0].backdrop).toBeUndefined();
    expect(formatLength(videos[0])).toBe("Movie");
  });

  it("keeps aired regular-season episodes and counts seasons", () => {
    const detail: TmdbTvDetail = {
      ...series,
      genres: [{ id: 18, name: "Drama" }],
      tagline: "Winter is coming.",
      credits: {
        cast: [
          { id: 2, name: "Kit Harington", character: "Jon Snow", order: 1 },
          { id: 1, name: "Emilia Clarke", character: "Daenerys Targaryen", order: 0 },
        ],
        crew: [],
      },
      episode_run_time: [],
      number_of_seasons: 2,
      seasons: [],
      created_by: [{ id: 9, name: "David Benioff" }],
      content_ratings: { results: [{ iso_3166_1: "US", rating: "TV-MA" }] },
      recommendations: { page: 1, results: [], total_pages: 1, total_results: 0 },
    };
    const episode = (season: number, number: number, airDate: string | null) => ({
      id: season * 100 + number,
      name: `S${season}E${number}`,
      overview: "",
      season_number: season,
      episode_number: number,
      runtime: 55,
      air_date: airDate,
      still_path: null,
    });
    const { video } = mapTvDetail(
      detail,
      [
        { season_number: 0, episodes: [episode(0, 1, "2010-01-01")] },
        { season_number: 1, episodes: [episode(1, 1, "2011-04-17"), episode(1, 2, "2011-04-24")] },
        { season_number: 2, episodes: [episode(2, 1, "2099-01-01"), episode(2, 2, null)] },
      ],
      genres,
    );

    expect(video.episodes?.map(item => item.id)).toEqual(["tv-1399-s1e1", "tv-1399-s1e2"]);
    expect(video.episodes?.[0].thumbnail).toBe("https://image.tmdb.org/t/p/w1280/backdrop.jpg");
    expect(video.seasonCount).toBe(1);
    expect(video.runtime).toBe(55);
    expect(video.rating).toBe("TV-MA");
    expect(video.tagline).toBe("Winter is coming.");
    expect(video.cast?.map(member => member.name)).toEqual(["David Benioff", "Emilia Clarke", "Kit Harington"]);
    expect(formatLength(video)).toBe("1 Season");
  });
});
