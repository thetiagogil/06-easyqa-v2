import { createVote, fetchVotesByTargetId } from "@/lib/api/votes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetVotesByTargetId = (targetId: string) =>
  useQuery({
    queryKey: ["votes", targetId],
    queryFn: () => fetchVotesByTargetId(targetId),
    enabled: !!targetId,
    staleTime: 10000,
  });

export const useCreateAndUpdateVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVote,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["votes", variables.target_id],
      });
    },
  });
};
