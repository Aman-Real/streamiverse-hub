import type { AppNotification } from "@/features/notifications/types";

/** MOCK DATA - replace with a real feed when the backend lands. */
export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  { id: "1", title: "New Release", message: "Neon Metropolis is now available!", time: "2 hours ago", read: false },
  { id: "2", title: "Continue Watching", message: "Resume Lost Temples where you left off", time: "1 day ago", read: false },
  { id: "3", title: "Recommendation", message: "Based on your history: Beyond the Stars", time: "3 days ago", read: true },
];
