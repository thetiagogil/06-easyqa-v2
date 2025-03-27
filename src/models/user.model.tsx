type UserModel = {
  id: number;
  name: string;
  wallet: `0x${string}`;
  bio: string | null;
  avatar: string | null;
  created_at: Date;
  updated_at: Date;
};
