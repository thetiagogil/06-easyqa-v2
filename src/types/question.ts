import { Answer } from "./answer";
import { User } from "./user";

export interface Question {
  id: number;
  user_id: number;
  title: string;
  content?: string;
  status: "open" | "closed" | "answered";
  vote_score: number;
  created_at: string;
  updated_at: string;
  user?: User;
  viewer_vote_value?: 1 | -1;
  answer_count?: number;
  answers?: Answer[];
}
