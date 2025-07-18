import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { EXPLORE_PAGE_SEARCH_SIZE } from "@/lib/constants";
import { Question } from "@/types/question";
import { User } from "@/types/user";
import { usePrivy } from "@privy-io/react-auth";
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetUsers = (search?: string) =>
  useInfiniteQuery<User[], Error>({
    queryKey: ["users", search || ""],
    initialPageParam: 0,
    queryFn: async (context: QueryFunctionContext) => {
      const pageParam = (context.pageParam as number) ?? 0;
      const params = new URLSearchParams();
      params.set("limit", EXPLORE_PAGE_SEARCH_SIZE.toString());
      params.set("offset", (pageParam * EXPLORE_PAGE_SEARCH_SIZE).toString());
      if (search) params.set("search", search);

      const res = await fetch(`/api/users?${params.toString()}`);

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to fetch users";
        throw new Error(message);
      }
      return await res.json();
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === EXPLORE_PAGE_SEARCH_SIZE ? allPages.length : undefined,
  });

export const useGetUserById = (userId: number) => {
  const { currentUser } = useAuthContext();
  const viewerId = currentUser?.id;

  return useQuery<User & { isViewerFollowing?: boolean }>({
    queryKey: ["user", userId, viewerId],
    enabled: !!userId,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (viewerId) {
        params.set("viewer_id", String(viewerId));
      }

      const res = await fetch(`/api/users/${userId}?${params.toString()}`);

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to fetch user";
        throw new Error(message);
      }

      return await res.json();
    },
  });
};

export const useUpdateUser = () => {
  type MutationProps = {
    userId: number;
    data: Partial<User>;
  };

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async ({ userId, data }: MutationProps) => {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      showSnackbar("Profile updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useGetUserQuestions = (userId: number, enabled: boolean = true) => {
  const { currentUser } = useAuthContext();
  const { ready } = usePrivy();
  const viewerId = currentUser?.id;

  return useQuery<Question[]>({
    queryKey: ["user-questions", userId],
    enabled: enabled && !!userId && ready,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (viewerId) {
        params.set("viewer_id", String(viewerId));
      }

      const res = await fetch(`/api/users/${userId}/questions?${params.toString()}`);

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to fetch user questions";
        throw new Error(message);
      }

      return await res.json();
    },
  });
};

export const useGetUserAnsweredQuestions = (userId: number, enabled: boolean = true) => {
  const { currentUser } = useAuthContext();
  const { ready } = usePrivy();
  const viewerId = currentUser?.id;

  return useQuery<Question[]>({
    queryKey: ["user-answers", userId],
    enabled: enabled && !!userId && ready,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (viewerId) {
        params.set("viewer_id", String(viewerId));
      }

      const res = await fetch(`/api/users/${userId}/answers?${params.toString()}`);

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to fetch user answers";
        throw new Error(message);
      }

      return await res.json();
    },
  });
};
