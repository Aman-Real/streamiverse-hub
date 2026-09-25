/** Subscription plans. Only the server (the payment webhook) moves an account off "free". */
export type Plan = "free" | "pro";

/** users/{uid}: the account's profile document. */
export interface UserProfile {
  displayName: string;
  email: string;
  plan: Plan;
  /** Uploaded profile photo as a JPEG data URL; null when the member hasn't uploaded one. */
  photoUrl: string | null;
  /** Server time the account's document was created (estimated locally until the server confirms it). */
  createdAt: Date | null;
}
