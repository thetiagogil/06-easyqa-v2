export interface User {
  id: number;
  privy_id: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  wallet?: string;
  isViewerFollowing?: boolean;
}
