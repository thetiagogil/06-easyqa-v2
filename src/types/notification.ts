import { NotificationType } from "./common";

export interface NotificationDb {
  id: number;
  userId: number;
  type: NotificationType;
  related_id: number;
  isRead: boolean;
  createdAt?: string;
}

export interface Notification extends NotificationDb {}
