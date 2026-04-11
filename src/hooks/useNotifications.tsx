import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const defaultNotifications: Notification[] = [
  { id: "1", title: "New Release", message: "Neon Metropolis is now available!", time: "2 hours ago", read: false },
  { id: "2", title: "Continue Watching", message: "Resume Lost Temples where you left off", time: "1 day ago", read: false },
  { id: "3", title: "Recommendation", message: "Based on your history: Beyond the Stars", time: "3 days ago", read: true },
];

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
};
