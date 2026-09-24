import { describe, expect, it } from "vitest";
import type { Episode, Video } from "@/features/catalog/types";
import { getResumeLabel } from "@/features/catalog/utils/catalog";
import type { ProgressEntry } from "@/features/watch-progress/types";
import {
  applyProgress,
  isInProgress,
  resolveEpisode,
  resumePosition,
  toProgressUpdate,
  toWatchedVideo,
} from "@/features/watch-progress/utils/progress";

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

const series: Video = {
  id: "tv-1",
  title: "Show",
  description: "",
  thumbnail: "poster.jpg",
  backdrop: "backdrop.jpg",
  runtime: 50,
  genre: "Drama",
  year: 2024,
  rating: "TV-MA",
  score: 8,
  match: 80,
  formats: ["HD"],
  progress: 0,
  videoUrl: "video.mp4",
  type: "series",
  seasonCount: 2,
  episodes: [episode(1, 1), episode(1, 2), episode(2, 1)],
};

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

describe("toProgressUpdate", () => {
  it("records position, percentage and episode", () => {
    const update = toProgressUpdate(series, { positionSeconds: 1200.7, durationSeconds: 3000 }, episode(1, 2));
    expect(update).toMatchObject({ progress: 40, positionSeconds: 1200, durationSeconds: 3000, season: 1, episode: 2 });
    expect(update?.title.id).toBe("tv-1");
  });

  it("counts the last few percent as finished", () => {
    expect(toProgressUpdate(series, { positionSeconds: 2900, durationSeconds: 3000 })?.progress).toBe(100);
  });

  it("waits until the stream's length is known", () => {
    expect(toProgressUpdate(series, { positionSeconds: 0, durationSeconds: Number.NaN })).toBeNull();
  });
});

describe("resuming", () => {
  it("prefers the URL episode, then the one in progress, then the first", () => {
    expect(resolveEpisode(series, { season: 2, episode: 1 }, entry())?.id).toBe("tv-1-s2e1");
    expect(resolveEpisode(series, null, entry())?.id).toBe("tv-1-s1e2");
    expect(resolveEpisode(series, null, undefined)?.id).toBe("tv-1-s1e1");
  });

  it("resumes only the same episode, and restarts finished ones", () => {
    expect(resumePosition(entry(), episode(1, 2))).toBe(1200);
    expect(resumePosition(entry(), episode(1, 1))).toBe(0);
    expect(resumePosition(entry({ progress: 100 }), episode(1, 2))).toBe(0);
    expect(resumePosition(undefined, episode(1, 1))).toBe(0);
  });
});

describe("progress on cards", () => {
  it("marks the matching episode", () => {
    const video = applyProgress(series, entry());
    expect(video.progress).toBe(40);
    expect(video.episodes?.map(item => item.progress)).toEqual([0, 40, 0]);
  });

  it("builds continue-watching cards from the played stream", () => {
    const video = toWatchedVideo(entry());
    expect(video.runtime).toBe(50);
    expect(isInProgress(video)).toBe(true);
    expect(getResumeLabel(video)).toBe("S1:E2 • 30m left");
    expect(isInProgress(toWatchedVideo(entry({ progress: 100 })))).toBe(false);
  });
});
