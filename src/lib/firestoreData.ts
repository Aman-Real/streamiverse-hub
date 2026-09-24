import { Timestamp } from "firebase/firestore";

/*
 * Defensive readers for Firestore documents. A document can predate a schema change or be edited by
 * hand in the console, so every field is type-checked before the UI sees it.
 */

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const readString = (value: unknown, fallback = ""): string => (typeof value === "string" ? value : fallback);

export const readNumber = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

export const readOptionalString = (value: unknown): string | null => (typeof value === "string" ? value : null);

export const readOptionalNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

/** Firestore Timestamp -> Date. Read documents with serverTimestamps: "estimate" so pending writes have one too. */
export const readDate = (value: unknown): Date | null => (value instanceof Timestamp ? value.toDate() : null);
