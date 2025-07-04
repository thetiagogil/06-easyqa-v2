import { useSnackbarContext } from "@/contexts/snackbar.context";
import { Answer } from "@/types/answer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAnswer = (questionId: number) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async (data: Partial<Answer>) => {
      const res = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, question_id: questionId }),
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
