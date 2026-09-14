import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  NotificationsContext,
  type NotificationsContextValue,
} from "@/features/notifications/context/NotificationsContext";
import { DEFAULT_NOTIFICATIONS } from "@/features/notifications/data/notifications.mock";
import type { AppNotification } from "@/features/notifications/types";

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(DEFAULT_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter(notification => !notification.read).length,
    [notifications],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications(previous =>
      previous.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(previous => previous.map(notification => ({ ...notification, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const value = useMemo<NotificationsContextValue>(
    () => ({ notifications, unreadCount, markAsRead, markAllRead, clearAll }),
    [notifications, unreadCount, markAsRead, markAllRead, clearAll],
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
};
