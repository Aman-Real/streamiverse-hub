import { PLAYER_CONFIG } from "@/config/player.config";
import type { Episode, Video } from "@/features/catalog/types";
import { parseTitleId } from "@/features/catalog/utils/titleId";

export class PlayerEmbedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlayerEmbedError";
  }
}

interface PlayerEmbedOptions {
  /** Seconds to resume from. */
  startAt?: number;
  /** Stream quality in lines, e.g. 1080 or 720 (from the HD Streaming setting). */
  quality: number;
}

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return search.toString();
};

/**
 * The embed player URL for a movie or one series episode. Autoplaying the next episode is handled by
 * the app (so watch progress follows it), which is why the player's own autonext stays off.
 */
export const getPlayerEmbedUrl = (video: Video, episode: Episode | undefined, { startAt = 0, quality }: PlayerEmbedOptions): string => {
  const parsed = parseTitleId(video.id);
  if (!parsed) throw new PlayerEmbedError(`Invalid Streamix title id: "${video.id}".`);

  const shared = {
    quality: String(quality),
    autoplay: "true",
    continueprompt: "false",
    autonext: "false",
    t: startAt > 0 ? Math.floor(startAt) : undefined,
  };

  if (parsed.type === "movie") {
    return `${PLAYER_CONFIG.embedBaseUrl}/movie/${parsed.tmdbId}?${buildQuery(shared)}`;
  }

  if (!episode) throw new PlayerEmbedError("Select a TV episode before starting playback.");

  return `${PLAYER_CONFIG.embedBaseUrl}/tv/${parsed.tmdbId}?${buildQuery({ s: episode.season, e: episode.number, ...shared })}`;
};