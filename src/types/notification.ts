import { NotificationType } from "./common";

export interface Noticiation {
  id: number;
  user_id: number;
  type: NotificationType;
  related_id: number;
  created_at: string;
  is_read: boolean;
}
