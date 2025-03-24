import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserByWallet = (wallet: `0x${string}` | undefined) => {
  return useQuery({
    queryKey: ["user", wallet],
    queryFn: async () => {
      return (await fetch(`/api/users/${wallet}`)).json();
    },
    enabled: !!wallet,
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
