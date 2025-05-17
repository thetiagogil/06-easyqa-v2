// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface QuestionModel {
  id: string;
  user_id: UserModel["id"];
  user?: UserModel;
  hash: string;
  title: string;
  content: string;
  status: "open" | "closed" | "answered";
  created_at: Date;
  updated_at: Date;
  vote_score: number;
}
