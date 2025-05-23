// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface VotesModel {
  id: string;
  user_id: UserModel["id"];
  target_id: QuestionModel["id"] | AnswerModel["id"];
  type: "upvote" | "downvote";
  created_at: Date;
}
