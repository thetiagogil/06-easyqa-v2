import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { SortType } from "@/types";
import { Question } from "@/types/question";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useGetQuestions = (
  sort: SortType = "new",
  page: number = 1,
  pageSize: number = 10,
  enabled: boolean = true,
) => {
  const { currentUser } = useAuthContext();
  const { ready } = usePrivy();
  const { showSnackbar } = useSnackbarContext();
  const viewerId = currentUser?.id;

  return useQuery({
    queryKey: ["questions", sort, page, viewerId ?? null],
    enabled: enabled && ready,
    queryFn: async (): Promise<Question[]> => {
      const params = new URLSearchParams();
      params.set("sort", sort);
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());

      if (viewerId) {
        params.set("viewer_id", String(viewerId));
      }

      const res = await fetch(`/api/questions?${params.toString()}`);

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to fetch questions";
        showSnackbar(message);
        throw new Error(message);
      }

      return await res.json();
    },
  });
};

export const useGetQuestionById = (id: number, enabled = true) => {
  const { currentUser } = useAuthContext();
  const { ready } = usePrivy();
  const { showSnackbar } = useSnackbarContext();
  const viewerId = currentUser?.id;

  return useQuery({
    queryKey: ["question", id, viewerId ?? null],
    enabled: enabled && ready && !!id,
    queryFn: async (): Promise<Question> => {
      const params = new URLSearchParams();
      if (viewerId) params.set("viewer_id", String(viewerId));

      const res = await fetch(`/api/questions/${id}?${params.toString()}`);

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to fetch question";
        showSnackbar(message);
        throw new Error(message);
      }

      return await res.json();
    },
  });
};
