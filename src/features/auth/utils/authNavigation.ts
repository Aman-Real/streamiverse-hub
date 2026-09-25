import { ROUTES } from "@/app/routes";
import type { AuthMode } from "@/features/auth/types";

const AUTH_MODES: readonly AuthMode[] = ["sign-in", "sign-up", "reset-password"];

/** URL of the auth screen opened on a given form, e.g. authPath("sign-up") -> "/auth?mode=sign-up". */
export const authPath = (mode: AuthMode = "sign-in") => `${ROUTES.auth}?mode=${mode}`;

/** Reads ?mode= from the URL, falling back to sign in for missing or unknown values. */
export const parseAuthMode = (value: string | null): AuthMode => AUTH_MODES.find(mode => mode === value) ?? "sign-in";

/** Router state that tells the auth screen where to send people after they sign in, and why they were sent there. */
export interface AuthRedirectState {
  from?: string;
  /** Shown above the form, e.g. "Sign in to watch titles." */
  message?: string;
}

/** Where to go after signing in: the page they came from, or home. Never points back at the auth screen. */
export const getReturnPath = (state: unknown): string => {
  const from = (state as AuthRedirectState | null)?.from;
  const isInAppPath = from?.startsWith("/") && !from.startsWith("//") && !from.startsWith(ROUTES.auth);
  return isInAppPath && from ? from : ROUTES.home;
};

/** Why the auth screen was opened, if the page that sent people there said. */
export const getAuthNotice = (state: unknown): string | null => {
  const message = (state as AuthRedirectState | null)?.message;
  return typeof message === "string" && message.trim() ? message : null;
};

/** Router state for a link to the auth screen that brings people back here afterwards. On the auth screen itself, it keeps the original destination. */
export const redirectStateFor = ({ pathname, search, state }: { pathname: string; search: string; state: unknown }): AuthRedirectState => ({
  from: pathname === ROUTES.auth ? getReturnPath(state) : `${pathname}${search}`,
});
