type QuestionModel = {
  id: string;
  hash: string;
  user_id: UserModel["id"];
  title: string;
  content: string;
  status: "open" | "closed" | "answered";
  created_at: Date;
  updated_at: Date;
};
