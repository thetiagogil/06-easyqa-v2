import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetVotesByTargetId = (
  targetId: QuestionModel["id"] | AnswerModel["id"]
) => {
  return useQuery({
    queryKey: ["votes", targetId],
    queryFn: async () => {
      return (await fetch(`/api/votes/${targetId}`)).json();
    },
    enabled: !!targetId,
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
  return useMutation({
    mutationFn: async (vote: VotePayload) => {
      return await fetch("/api/votes", {
        method: "POST",
        body: JSON.stringify(vote),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());
    },
  });
};
