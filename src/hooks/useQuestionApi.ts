import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { SortType } from "@/types";
import { Question } from "@/types/question";
import { useQuery } from "@tanstack/react-query";

export const useGetQuestions = (
  sort: SortType = "new",
  page: number = 1,
  pageSize: number = 10,
  enabled: boolean = true,
) => {
  const { currentUser, isUserReady } = useAuthContext();
  const { showSnackbar } = useSnackbarContext();

  return useQuery({
    queryKey: ["questions", sort, page, currentUser?.id ?? null],
    enabled: enabled && isUserReady,
    queryFn: async (): Promise<Question[]> => {
      const params = new URLSearchParams();
      params.set("sort", sort);
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());

      if (currentUser?.id) {
        params.set("user_id", String(currentUser.id));
      }

      const res = await fetch(`/api/questions?${params.toString()}`);

      if (!res.ok) {
        const error = await res.json();
        showSnackbar(error.message || "Failed to fetch questions", "danger");
        return [];
      }

      const data = await res.json();
      return data;
    },
  });
};
