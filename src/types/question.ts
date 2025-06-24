import { User } from "./user";

export interface Question {
  id: number;
  user: User;
  title: string;
  content?: string;
  status: "open" | "closed" | "answered";
  vote_score: number;
  current_user_vote?: 1 | -1;
  created_at: string;
  updated_at: string;
}
