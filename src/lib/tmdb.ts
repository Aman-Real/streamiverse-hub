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

interface TmdbValidateKeyResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

/** TMDB's "Validate Key" endpoint: resolves when the token is accepted, throws TmdbError when not. */
export const validateTmdbToken = (signal?: AbortSignal) =>
  tmdbFetch<TmdbValidateKeyResponse>("/authentication", { signal });
