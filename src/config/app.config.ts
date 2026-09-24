/** Branding and copy that appears in more than one place. */
export const APP_CONFIG = {
  /** Wordmark in the navbar. */
  brand: "STREAMIX",
  /** Prose name used in body copy. */
  name: "Streamix",
  supportEmail: "support@streamix.app",
  copyrightYear: 2025,
} as const;

/** Shown wherever an account's details go when nobody is signed in. */
export const GUEST_ACCOUNT = {
  name: "Guest",
  email: "Not signed in",
} as const;
