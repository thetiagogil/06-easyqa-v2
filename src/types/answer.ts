import { Question } from "./question";
import { User } from "./user";

export interface AnswerDb {
  id: number;
  userId: number;
  questionId: number;
  content: string;
  accepted: boolean;
  vote_score: number;
  createdAt?: string;
}

export interface Answer extends AnswerDb {
  user: User;
  question?: Question;
  viewer_vote_value?: 1 | -1;
}
