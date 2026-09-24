import { createContext } from "react";
import type { AppNotification } from "@/features/notifications/types";

export interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null);
