/**
 * Named AppNotification, not Notification - the latter is a DOM global, and
 * shadowing it means TypeScript stops warning you about real Web Notification
 * API mistakes.
 */
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  /** Pre-formatted relative time, e.g. "2 hours ago". */
  time: string;
  read: boolean;
}
