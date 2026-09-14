/**
 * Format seconds as "m:ss".
 * Guards against NaN, which <video>.duration returns before metadata loads -
 * the old inline formatter rendered "NaN:NaN" for a beat on every open.
 */
export const formatPlaybackTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};
