export interface FollowDb {
  follower_id: number;
  following_id: number;
  followed_at: string;
}

export interface Follow extends FollowDb {}
