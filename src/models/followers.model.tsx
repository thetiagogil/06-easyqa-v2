// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface FollowersModel {
  id: string;
  follower_id: UserModel["id"];
  following_id: UserModel["id"];
  status: "pending" | "accepted";
  created_at: Date;
  updated_at: Date;
}
