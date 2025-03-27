type AnswerModel = {
  id: string;
  hash: string;
  user_id: UserModel["id"];
  question_id: QuestionModel["id"];
  content: string;
  accepted: boolean;
  created_at: Date;
  updated_at: Date;
};
