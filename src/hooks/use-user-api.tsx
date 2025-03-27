import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserById = (id: UserModel["id"]) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      return (await fetch(`/api/users/${id}`)).json();
    },
    enabled: !!id,
  });
};

export const useCreateUserByWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ wallet }: { wallet: `0x${string}` }) => {
      return (
        await fetch(`/api/users/auth/${wallet}`, {
          method: "POST",
        })
      ).json();
    },
    onSuccess: (data, wallet) => {
      queryClient.setQueryData(["user", wallet], data);
    },
  });
};

export const useGetUserQuestions = (userId: QuestionModel["user_id"]) => {
  return useQuery({
    queryKey: ["user-questions", userId],
    queryFn: async () => {
      return (await fetch(`/api/users/${userId}/questions`)).json();
    },
    enabled: !!userId,
  });
};

export const useGetUserAnsweredQuestions = (
  userId: QuestionModel["user_id"]
) => {
  return useQuery({
    queryKey: ["user-answered-questions", userId],
    queryFn: async () => {
      return (await fetch(`/api/users/${userId}/answers`)).json();
    },
    enabled: !!userId,
  });
};
