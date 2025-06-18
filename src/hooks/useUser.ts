import { useSnackbarContext } from "@/contexts/snackbar.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SetupUserData {
  userId: string;
  name: string;
}

export const useSetupUser = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async ({ userId, name }: SetupUserData) => {
      const res = await fetch("/api/user/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, name }),
      });

      if (!res.ok) {
        const error = await res.json();
        showSnackbar(error.message || "Failed to set up user", "danger");
        return null;
      }

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
