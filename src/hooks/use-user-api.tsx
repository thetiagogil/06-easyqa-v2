import {
  createUserByWallet,
  fetchUserAnsweredQuestions,
  fetchUserById,
  fetchUserQuestions,
} from "@/lib/api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type QueryOptions = { enabled?: boolean };

export const useGetUserById = (id: number, options: QueryOptions = {}) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
    ...options,
  });

export const useGetUserQuestions = (
  userId: number,
  options: QueryOptions = {}
) =>
  useQuery({
    queryKey: ["user-questions", userId],
    queryFn: () => fetchUserQuestions(userId),
    enabled: !!userId,
    ...options,
  });

export const useGetUserAnsweredQuestions = (
  userId: number,
  options: QueryOptions = {}
) =>
  useQuery({
    queryKey: ["user-answered-questions", userId],
    queryFn: () => fetchUserAnsweredQuestions(userId),
    enabled: !!userId,
    ...options,
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
