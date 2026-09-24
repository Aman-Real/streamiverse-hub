import { TMDB_CONFIG } from "@/config/tmdb.config";

/** Query-string values; undefined entries are skipped. */
export type TmdbParams = Record<string, string | number | boolean | undefined>;

interface TmdbFetchOptions {
  params?: TmdbParams;
  /** Pass React Query's signal so abandoned requests get cancelled. */
  signal?: AbortSignal;
}

/** Any non-2xx TMDB response, carrying TMDB's own status_message. */
export class TmdbError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

/**
 * Typed GET against TMDB's v3 API, authenticated with the Read Access Token.
 * Every TMDB request in the app goes through here.
 */
export async function tmdbFetch<T>(path: string, { params, signal }: TmdbFetchOptions = {}): Promise<T> {
  const url = new URL(`${TMDB_CONFIG.apiBaseUrl}${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    signal,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_CONFIG.readToken}`,
    },
  });

  if (!response.ok) {
    const body: { status_message?: string } | null = await response.json().catch(() => null);
    throw new TmdbError(response.status, body?.status_message ?? response.statusText);
  }

  return response.json() as Promise<T>;
}

/** True when TMDB (or a malformed title id) says the title doesn't exist. */
export const isTmdbNotFound = (error: unknown) => error instanceof TmdbError && error.status === 404;

/** A failed TMDB request, explained for developers: what went wrong and the most likely fix. */
export const describeTmdbError = (error: unknown): { title: string; description: string } => {
  const token = TMDB_CONFIG.readToken;
  if (!token) {
    return {
      title: "TMDB token not found",
      description:
        "VITE_TMDB_READ_TOKEN is empty. Keep .env.local in the project root (next to package.json), then restart the dev server.",
    };
  }
  if (error instanceof TmdbError && error.status === 401) {
    const hint = token.startsWith("eyJ")
      ? ""
      : " Use the API Read Access Token (the long value starting with eyJ), not the short v3 API Key, and without a Bearer prefix.";
    return { title: "TMDB rejected the token", description: `${error.message}${hint}` };
  }
  if (error instanceof TmdbError) {
    return { title: `TMDB responded with HTTP ${error.status}`, description: `${error.message} Try again in a minute.` };
  }
  return {
    title: "Couldn't reach TMDB",
    description:
      "api.themoviedb.org didn't respond. Check your connection, or try another network or DNS in case your ISP blocks it.",
  };
};
