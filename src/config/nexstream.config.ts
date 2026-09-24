/**
 * NexStream configuration.
 *
 * The API key is intentionally read from Vite's client environment because NexStream
 * uses a domain-locked browser embed key. Keep the real value in .env.local and never
 * commit it to source control.
 */
export const NEXSTREAM_CONFIG = {
  apiBaseUrl: "https://api.codespecters.com",
  apiKey: import.meta.env.VITE_NEXTSTREAM_API?.trim() ?? "",
} as const;
