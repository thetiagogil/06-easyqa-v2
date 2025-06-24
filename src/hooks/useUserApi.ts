import { useSnackbarContext } from "@/contexts/snackbar.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = () => {
  type MutationProps = {
    userId: number;
    name: string;
  };
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async ({ userId, name }: MutationProps) => {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to update user";
        showSnackbar(message, "danger");
        throw new Error(message);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
