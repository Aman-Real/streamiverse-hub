/** The signed-in user, in the shape the UI needs (kept separate from Firebase's User type). */
export interface AuthUser {
  uid: string;
  /** Display name, falling back to the part of the email before "@". */
  name: string;
  email: string;
  photoUrl: string | null;
}

/** "loading" lasts until Firebase has restored (or ruled out) a saved session on page load. */
export type AuthStatus = "loading" | "signedIn" | "signedOut";

/** Which form the auth screen shows; also the value of its ?mode= query param. */
export type AuthMode = "sign-in" | "sign-up" | "reset-password";
