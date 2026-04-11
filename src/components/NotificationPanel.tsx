import { Bell, Check, Trash2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ open, onClose }: NotificationPanelProps) => {
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-12 right-0 z-50 w-80 bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
            )}
            {notifications.length > 0 && (
              <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
          ) : (
            notifications.map(n => (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-accent/50 transition-colors ${!n.read ? "bg-accent/20" : ""}`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <span className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />}
                  <div className={!n.read ? "" : "ml-4"}>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
