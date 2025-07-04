import { Question } from "./question";
import { User } from "./user";

export interface Answer {
  id: number;
  user_id: number;
  question_id: number;
  content: string;
  accepted: boolean;
  vote_score: number;
  created_at: string;
  updated_at: string;
  user?: User;
  question?: Question;
  viewer_vote_value?: 1 | -1;
}
