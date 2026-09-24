import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Elena Vance" -> "EV", for avatar fallbacks. */
export const getInitials = (name: string) =>
  name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();

/** For .filter(isPresent): drops null and undefined, and tells TypeScript they're gone. */
export const isPresent = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;
