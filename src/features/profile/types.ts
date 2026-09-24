/** Subscription plans. Only the server (the payment webhook) moves an account off "free". */
export type Plan = "free" | "pro";

/** users/{uid}: the account's profile document. */
export interface UserProfile {
  displayName: string;
  email: string;
  plan: Plan;
  /** Server time the account's document was created (estimated locally until the server confirms it). */
  createdAt: Date | null;
}
