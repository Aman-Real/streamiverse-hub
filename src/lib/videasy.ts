import type { Episode, Video } from "@/features/catalog/types";
import { parseTitleId } from "@/features/catalog/utils/titleId";
import { VIDEASY_CONFIG } from "@/config/videasy.config";

export class VideasyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideasyError";
  }
}

/**
 * Builds the Videasy player URL from the TMDB id already embedded in Streamix title ids.
 * Movies: /movie/{tmdbId}
 * TV episodes: /tv/{tmdbId}/{season}/{episode}
 */
export const getVideasyEmbedUrl = (video: Video, episode?: Episode): string => {
  const parsed = parseTitleId(video.id);

  if (!parsed) {
    throw new VideasyError(`Invalid Streamix title id: "${video.id}".`);
  }

  if (parsed.type === "movie") {
    return `${VIDEASY_CONFIG.playerBaseUrl}/movie/${parsed.tmdbId}`;
  }

  if (!episode) {
    throw new VideasyError("Select a TV episode before starting playback.");
  }

  return `${VIDEASY_CONFIG.playerBaseUrl}/tv/${parsed.tmdbId}/${episode.season}/${episode.number}`;
};
