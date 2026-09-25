/**
 * The embedded video player's provider. This is the only file that names it: point these values at
 * another compatible embed player and nothing else in the app needs to change.
 */
export const PLAYER_CONFIG = {
  /** Base address of the provider's embed pages. */
  embedBaseUrl: "https://cinesrc.st/embed",
  /** Origin the player's postMessage events come from; messages from anywhere else are ignored. */
  origin: "https://cinesrc.st",
  /** Names of the postMessage events the player sends. */
  events: {
    error: "cinesrc:error",
    ended: "cinesrc:ended",
    pause: "cinesrc:pause",
    timeupdate: "cinesrc:timeupdate",
  },
} as const;