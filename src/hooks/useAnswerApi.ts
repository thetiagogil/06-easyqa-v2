import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { Answer } from "@/types/answer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAnswer = (questionId: number) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();
  const { currentUser } = useAuthContext();

  return useMutation({
    mutationFn: async (data: Partial<Answer>) => {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, question_id: questionId, user_id: currentUser?.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to create answer";
        showSnackbar(message, "danger");
        throw new Error(message);
      }

      return await res.json();
    },
    onSuccess: () => {
      showSnackbar("Answer created", "success");
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    },
  });
};

export const useAcceptAnswer = (questionId: number) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();
  const { currentUser } = useAuthContext();

  return useMutation({
    mutationFn: async (answerId: number) => {
      const res = await fetch(`/api/answers/${answerId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser?.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to accept answer";
        showSnackbar(message, "danger");
        throw new Error(message);
      }

      return await res.json();
    },
    onSuccess: () => {
      showSnackbar("Answer accepted", "success");
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    },
  });
};
