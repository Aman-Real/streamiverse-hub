import { NEXSTREAM_CONFIG } from "@/config/nexstream.config";
import type { Episode, Video } from "@/features/catalog/types";
import { parseTitleId } from "@/features/catalog/utils/titleId";

export class NexStreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NexStreamError";
  }
}

const buildUrl = (path: string, progressSeconds = 0) => {
  if (!NEXSTREAM_CONFIG.apiKey) {
    throw new NexStreamError(
      "NexStream API key is missing. Add VITE_NEXTSTREAM_API to .env.local and restart the Vite dev server.",
    );
  }

  const url = new URL(path, NEXSTREAM_CONFIG.apiBaseUrl);
  url.searchParams.set("apikey", NEXSTREAM_CONFIG.apiKey);

  if (Number.isFinite(progressSeconds) && progressSeconds > 0) {
    url.searchParams.set("progress", String(Math.floor(progressSeconds)));
  }

  return url.toString();
};

/**
 * Builds the NexStream embed URL from the same TMDB IDs already used by Streamix.
 * NexStream accepts TMDB IDs directly, so no additional metadata lookup is needed.
 */
export const getNexStreamEmbedUrl = (
  video: Video,
  episode?: Episode,
  progressSeconds = 0,
): string => {
  const parsed = parseTitleId(video.id);
  if (!parsed) throw new NexStreamError(`Invalid Streamix title id: "${video.id}".`);

  if (parsed.type === "movie") {
    return buildUrl(`/embed/movie/${parsed.tmdbId}`, progressSeconds);
  }

  if (!episode) {
    throw new NexStreamError("Select a TV episode before starting playback.");
  }

  return buildUrl(
    `/embed/tv/${parsed.tmdbId}/${episode.season}/${episode.number}`,
    progressSeconds,
  );
};

export const hasNexStreamApiKey = () => Boolean(NEXSTREAM_CONFIG.apiKey);
