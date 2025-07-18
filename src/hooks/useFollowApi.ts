import { useAuthContext } from "@/contexts/auth.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollow = (targetUserId: number) => {
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: currentUser!.id,
          following_id: targetUserId,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to follow user");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", targetUserId, currentUser?.id] });
    },
  });

  const unfollow = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `/api/follows?follower_id=${currentUser!.id}&following_id=${targetUserId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to unfollow user");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", targetUserId, currentUser?.id] });
    },
  });

  return { follow, unfollow };
};
