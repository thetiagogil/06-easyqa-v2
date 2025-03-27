import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetVotesByQuestionId = (questionId: QuestionModel["id"]) => {
  return useQuery({
    queryKey: ["questionVotes", questionId],
    queryFn: async () => {
      return (await fetch(`/api/votes/${questionId}`)).json();
    },
    enabled: !!questionId,
    staleTime: 1000 * 10,
  });
};

export const useCreateAndUpdateVote = () => {
  type VotePayload = {
    user_id: number;
    target_id: string;
    target_type: "question" | "answer";
    type: "upvote" | "downvote";
  };
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vote: VotePayload) => {
      return (
        await fetch("/api/votes", {
          method: "POST",
          body: JSON.stringify(vote),
          headers: { "Content-Type": "application/json" },
        })
      ).json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["questionVotes", variables.target_id],
      });
    },
  });
};
