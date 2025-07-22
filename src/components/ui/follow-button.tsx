"use client";
import { useAuthContext } from "@/contexts/auth.context";
import { useFollow } from "@/hooks/useFollowApi";
import { Button } from "@mui/joy";
import { useState } from "react";

type FollowButtonProps = {
  targetUserId: number;
  isFollowing: boolean;
};

export const FollowButton = ({ targetUserId, isFollowing }: FollowButtonProps) => {
  const { currentUser } = useAuthContext();
  const { follow, unfollow } = useFollow(targetUserId);
  const [hover, setHover] = useState(false);

  const commonStyles = { width: 80, fontSize: 12, transition: "0.3s" };

  if (!currentUser || currentUser.id === targetUserId) return null;

  if (isFollowing) {
    return (
      <Button
        variant="outlined"
        color={hover ? "danger" : "primary"}
        size="sm"
        disabled={unfollow.isPending}
        loading={unfollow.isPending}
        onClick={() => unfollow.mutate()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={commonStyles}
      >
        {hover ? "Unfollow" : "Following"}
      </Button>
    );
  }

  return (
    <Button
      variant="outlined"
      color={hover ? "primary" : "neutral"}
      size="sm"
      disabled={follow.isPending}
      loading={follow.isPending}
      onClick={() => follow.mutate()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={commonStyles}
    >
      Follow
    </Button>
  );
};
