// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AnswerModel {
  id: string;
  user_id: UserModel["id"];
  question_id: QuestionModel["id"];
  hash: string;
  content: string;
  accepted: boolean;
  created_at: Date;
  updated_at: Date;
  vote_score: number;
}
