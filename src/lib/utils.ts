import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Elena Vance" -> "EV", for avatar fallbacks. */
export const getInitials = (name: string) =>
  name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
