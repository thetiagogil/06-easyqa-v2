import { useSnackbarContext } from "@/contexts/snackbar.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateUserData {
  userId: string;
  name: string;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async ({ userId, name }: UpdateUserData) => {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const error = await res.json();
        showSnackbar(error.message || "Failed to update user", "danger");
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
