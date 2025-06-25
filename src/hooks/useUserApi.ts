import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { Question } from "@/types/question";
import { User } from "@/types/user";
import { usePrivy } from "@privy-io/react-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useGetUserById = (userId: number) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to fetch user";
        throw new Error(message);
      }

      return res.json();
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

      return res.json();
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

      return res.json();
    },
  });
};
