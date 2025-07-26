import { Answer } from "./answer";
import { User } from "./user";

export interface QuestionDb {
  id: number;
  userId: number;
  title: string;
  content?: string;
  status: "open" | "closed" | "answered";
  vote_score: number;
  createdAt?: string;
}

export interface Question extends QuestionDb {
  user: User;
  viewer_vote_value?: 1 | -1;
  answer_count?: number;
  answers?: Answer[];
}
