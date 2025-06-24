import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { Question } from "@/types/question";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSubmitVote = () => {
  type MutationProps = {
    targetId: number;
    targetType: "question" | "answer";
    type: "upvote" | "downvote";
  };
  const { currentUser } = useAuthContext();
  const { showSnackbar } = useSnackbarContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetId, targetType, type }: MutationProps) => {
      if (!currentUser?.id) throw new Error("User not authenticated.");

      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          target_id: targetId,
          target_type: targetType,
          type,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to submit vote";
        showSnackbar(message, "danger");
        throw new Error(message);
      }

      return { targetId, targetType, type };
    },
    onSuccess: ({ targetId, type }) => {
      const voteValue = type === "upvote" ? 1 : -1;

      queryClient.setQueriesData<Question[]>({ queryKey: ["questions"] }, (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((q) => {
          if (q.id !== targetId) return q;

          const prevVote =
            q.current_user_vote === 1 ? "upvote" : q.current_user_vote === -1 ? "downvote" : null;

          let newScore = q.vote_score;
          let newVote: 1 | -1 | undefined = undefined;

          if (prevVote === type) {
            newScore += voteValue * -1;
            newVote = undefined;
          } else if (prevVote === null) {
            newScore += voteValue;
            newVote = voteValue as 1 | -1;
          } else {
            newScore += voteValue * 2;
            newVote = voteValue as 1 | -1;
          }

          return {
            ...q,
            vote_score: newScore,
            current_user_vote: newVote,
          };
        });
      });
    },
  });
};
