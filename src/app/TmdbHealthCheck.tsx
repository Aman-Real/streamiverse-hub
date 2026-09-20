import { useEffect } from "react";
import { toast } from "sonner";
import { TMDB_CONFIG } from "@/config/tmdb.config";
import { TmdbError, validateTmdbToken } from "@/lib/tmdb";

/** Error toasts stay up long enough to read the fix. */
const ERROR_TOAST_MS = 15000;

const reportFailure = (title: string, fix: string) => {
  console.error(`[TMDB] ${title}: ${fix}`);
  toast.error(title, { description: fix, duration: ERROR_TOAST_MS });
};

/** Validates the token once and names the most likely fix when it fails. */
const checkTmdbToken = async (signal: AbortSignal) => {
  const token = TMDB_CONFIG.readToken;
  if (!token) {
    reportFailure(
      "TMDB token not found",
      "VITE_TMDB_READ_TOKEN is empty. Keep .env.local in the project root (next to package.json), then restart the dev server.",
    );
    return;
  }

  try {
    await validateTmdbToken(signal);
    console.info("[TMDB] Connected: the Read Access Token is valid.");
    toast.success("TMDB connected", { description: "Your Read Access Token is valid." });
  } catch (error) {
    if (signal.aborted) return;
    if (error instanceof TmdbError && error.status === 401) {
      const hint = token.startsWith("eyJ")
        ? ""
        : " Use the API Read Access Token (the long value starting with eyJ), not the short v3 API Key, and without a Bearer prefix.";
      reportFailure("TMDB rejected the token", `${error.message}${hint}`);
    } else if (error instanceof TmdbError) {
      reportFailure(`TMDB responded with HTTP ${error.status}`, `${error.message} Try again in a minute.`);
    } else {
      reportFailure(
        "Couldn't reach TMDB",
        "api.themoviedb.org didn't respond. Check your connection, or try another network or DNS in case your ISP blocks it.",
      );
    }
  }
};

/**
 * DEV-ONLY: checks the TMDB token once on startup and reports through the app's toasts and the console.
 * Renders nothing. Remove it, and its line in AppProviders, once TMDB is feeding the catalog.
 */
const TmdbHealthCheck = () => {
  useEffect(() => {
    const controller = new AbortController();
    void checkTmdbToken(controller.signal);
    return () => controller.abort();
  }, []);

  return null;
};

export default TmdbHealthCheck;
