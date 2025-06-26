export interface Vote {
  id: number;
  user_id: number;
  target_id: number;
  target_type: "question" | "answer";
  value: 1 | -1;
  created_at: string;
}
