import { FirebaseError } from "firebase/app";

const FALLBACK_MESSAGE = "Something went wrong. Try again.";

/** Firebase Auth error codes, mapped to messages that say what to do next. */
const MESSAGES: Record<string, string> = {
  // With email enumeration protection on, a wrong email and a wrong password both report this.
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/invalid-login-credentials": "Email or password is incorrect.",
  "auth/user-not-found": "Email or password is incorrect.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/missing-password": "Enter your password.",
  "auth/email-already-in-use": "An account with this email already exists. Sign in instead.",
  "auth/weak-password": "Use a password with at least 6 characters.",
  "auth/password-does-not-meet-requirements": "That password is too weak. Try a longer one with letters and numbers.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes, then try again.",
  "auth/network-request-failed": "Can't reach the sign-in service. Check your connection and try again.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups for this site, then try again.",
  "auth/account-exists-with-different-credential":
    "This email is already registered with another sign-in method. Sign in with that method instead.",
  "auth/user-disabled": "This account has been disabled.",
  // Set-up problems: these point at the Firebase console setting to fix.
  "auth/operation-not-allowed": "This sign-in method is turned off in Firebase (Authentication > Sign-in method).",
  "auth/unauthorized-domain": "This domain isn't allowed to sign in. Add it in Firebase (Authentication > Settings > Authorized domains).",
};

/** The user closed or replaced the Google popup themselves; nothing to report. */
const SILENT_CODES = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/user-cancelled"]);

/** A message to show for a failed auth call, or null when there's nothing worth showing. */
export const getAuthErrorMessage = (error: unknown): string | null => {
  if (!(error instanceof FirebaseError)) return FALLBACK_MESSAGE;
  if (SILENT_CODES.has(error.code)) return null;
  return MESSAGES[error.code] ?? FALLBACK_MESSAGE;
};
