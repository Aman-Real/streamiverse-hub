import type { Episode, Video } from "@/features/catalog/types";
import { parseTitleId } from "@/features/catalog/utils/titleId";

const BASE_URL = "https://cinesrc.st/embed";

export class CineSrcError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CineSrcError";
  }
}

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return search.toString();
};

export const getCineSrcEmbedUrl = (
  video: Video,
  episode?: Episode,
  startAt = 0,
): string => {
  const parsed = parseTitleId(video.id);
  if (!parsed) throw new CineSrcError(`Invalid Streamix title id: "${video.id}".`);

  if (parsed.type === "movie") {
    const query = buildQuery({
      quality: "1080",
      autoplay: "true",
      continueprompt: "false",
      autonext: "false",
      t: startAt > 0 ? Math.floor(startAt) : undefined,
    });
    return `${BASE_URL}/movie/${parsed.tmdbId}${query ? `?${query}` : ""}`;
  }

  if (!episode) throw new CineSrcError("Select a TV episode before starting playback.");

  const query = buildQuery({
    s: episode.season,
    e: episode.number,
    quality: "1080",
    autoplay: "true",
    continueprompt: "false",
    autonext: "false",
    t: startAt > 0 ? Math.floor(startAt) : undefined,
  });

  return `${BASE_URL}/tv/${parsed.tmdbId}?${query}`;
};
