import { PLAYBACK_CONFIG } from "@/config/playback.config";
import type { TitleSnapshot, Video } from "@/features/catalog/types";
import { isRecord, readNumber, readString } from "@/lib/firestoreData";

/** The card fields of a Video, ready to store alongside a saved title. */
export const toTitleSnapshot = (video: Video): TitleSnapshot => ({
  id: video.id,
  type: video.type,
  title: video.title,
  thumbnail: video.thumbnail,
  backdrop: video.backdrop,
  genre: video.genre,
  year: video.year,
  runtime: video.runtime,
  rating: video.rating,
  score: video.score,
  match: video.match,
  seasonCount: video.seasonCount,
});

/** A card-ready Video rebuilt from a snapshot. Fields a snapshot doesn't keep get neutral defaults. */
export const fromTitleSnapshot = (snapshot: TitleSnapshot): Video => ({
  ...snapshot,
  description: "",
  formats: [PLAYBACK_CONFIG.format],
  progress: 0,
  videoUrl: PLAYBACK_CONFIG.sampleVideoUrl,
});

/** A snapshot read back from Firestore, type-checked field by field; null when it can't be a title. */
export const readTitleSnapshot = (value: unknown): TitleSnapshot | null => {
  if (!isRecord(value) || typeof value.id !== "string" || (value.type !== "movie" && value.type !== "series")) {
    return null;
  }
  return {
    id: value.id,
    type: value.type,
    title: readString(value.title),
    thumbnail: readString(value.thumbnail),
    backdrop: typeof value.backdrop === "string" ? value.backdrop : undefined,
    genre: readString(value.genre),
    year: readNumber(value.year),
    runtime: readNumber(value.runtime),
    rating: readString(value.rating),
    score: readNumber(value.score),
    match: readNumber(value.match),
    seasonCount: typeof value.seasonCount === "number" ? value.seasonCount : undefined,
  };
};
