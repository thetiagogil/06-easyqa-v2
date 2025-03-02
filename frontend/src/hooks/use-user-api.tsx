import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserByWallet = (wallet: `0x${string}` | undefined) => {
  return useQuery({
    queryKey: ["user", wallet],
    queryFn: async () => {
      const res = await fetch(`/api/users/${wallet}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
    enabled: !!wallet,
  });
};

export const useCreateUserByWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ wallet }: { wallet: `0x${string}` }) => {
      const res = await fetch(`/api/users/auth/${wallet}`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to create user");
      }
      return res.json();
    },
    onSuccess: (data, wallet) => {
      queryClient.setQueryData(["user", wallet], data);
    },
  });
};
