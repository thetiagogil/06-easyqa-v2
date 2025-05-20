import { createVote, fetchVotesByTargetId } from "@/lib/api/votes";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetVotesByTargetId = (targetId: string) =>
  useQuery({
    queryKey: ["votes", targetId],
    queryFn: () => fetchVotesByTargetId(targetId),
    enabled: !!targetId,
    staleTime: 10000,
  });

export const useCreateAndUpdateVote = () =>
  useMutation({
    mutationFn: createVote,
  });
