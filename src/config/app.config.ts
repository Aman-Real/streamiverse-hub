/** Branding and copy that appears in more than one place. */
export const APP_CONFIG = {
  /** Wordmark in the navbar. */
  brand: "STREAMIX",
  /** Prose name used in body copy. */
  name: "Streamix",
  supportEmail: "support@streamix.app",
  copyrightYear: 2025,
} as const;

/**
 * Placeholder account shown until real auth exists.
 * When you add auth, delete this and read the session user instead.
 */
export const DEMO_USER = {
  name: "Guest User",
  email: "guest@streamix.app",
  memberSince: "Jan 2024",
  plan: "Premium Plan",
} as const;
