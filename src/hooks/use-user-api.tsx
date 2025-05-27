import {
  createUserByWallet,
  getUserAnsweredQuestions,
  getUserById,
  getUserQuestions,
} from "@/lib/api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type QueryOptions = { enabled?: boolean };

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

export const useGetUserById = (id: number, options: QueryOptions = {}) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    ...options,
  });

export const useGetUserQuestions = (
  userId: number,
  options: QueryOptions = {}
) =>
  useQuery({
    queryKey: ["user-questions", userId],
    queryFn: () => getUserQuestions(userId),
    enabled: !!userId,
    ...options,
  });

export const useGetUserAnsweredQuestions = (
  userId: number,
  options: QueryOptions = {}
) =>
  useQuery({
    queryKey: ["user-answered-questions", userId],
    queryFn: () => getUserAnsweredQuestions(userId),
    enabled: !!userId,
    ...options,
  });
