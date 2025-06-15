import { useMutation, useQueryClient } from "@tanstack/react-query";

type SetupUserData = {
  userId: string;
  name: string;
};

export const useSetupUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, name }: SetupUserData) => {
      const res = await fetch("/api/user/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to set up user");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
