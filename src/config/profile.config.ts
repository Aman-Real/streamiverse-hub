/** Limits for what members can change on their profile. */
export const PROFILE_CONFIG = {
  displayName: { maxLength: 40 },
  /** Profile photos are cropped square, shrunk and stored as a small JPEG in the users/{uid} document. */
  photo: { size: 256, quality: 0.85, maxInputBytes: 10 * 1024 * 1024 },
} as const;
