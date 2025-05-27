import { submitVote } from "@/lib/api/votes";
import { useMutation } from "@tanstack/react-query";

export function useSubmitVote() {
  type VoteVariables = {
    userId: number;
    targetId: string;
    targetType: "question" | "answer";
    voteType: "upvote" | "downvote";
  };

  return useMutation<{ success: boolean }, Error, VoteVariables>({
    mutationFn: ({ userId, targetId, targetType, voteType }) =>
      submitVote(userId, targetId, targetType, voteType),
  });
}
