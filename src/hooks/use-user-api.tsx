import {
  createUserByWallet,
  fetchUserAnsweredQuestions,
  fetchUserById,
  fetchUserQuestions,
} from "@/lib/api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserById = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });

export const useGetUserQuestions = (userId: string) =>
  useQuery({
    queryKey: ["user-questions", userId],
    queryFn: () => fetchUserQuestions(userId),
    enabled: !!userId,
  });

export const useGetUserAnsweredQuestions = (userId: string) =>
  useQuery({
    queryKey: ["user-answered-questions", userId],
    queryFn: () => fetchUserAnsweredQuestions(userId),
    enabled: !!userId,
  });

export const useCreateUserByWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ wallet }: { wallet: `0x${string}` }) =>
      createUserByWallet(wallet),
    onSuccess: (data, { wallet }) => {
      queryClient.setQueryData(["user", wallet], data);
    },
  });
};
