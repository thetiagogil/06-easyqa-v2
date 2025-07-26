import { useSnackbarContext } from "@/contexts/snackbar.context";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/messages";
import { SortType } from "@/types";
import { Answer } from "@/types/answer";
import { Question } from "@/types/question";
import { usePrivy } from "@privy-io/react-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCurrentUserId } from "./useCurrentUserId";

export const useGetQuestions = (
  sort: SortType = "new",
  page: number = 1,
  pageSize: number = 10,
  enabled: boolean = true,
) => {
  const currentUserId = useCurrentUserId();
  const { showSnackbar } = useSnackbarContext();
  const { ready } = usePrivy();

  const query = useQuery({
    queryKey: ["questions", sort, page, currentUserId],
    enabled: enabled && ready,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      if (currentUserId) params.set("viewerId", String(currentUserId));

      const res = await fetch(`/api/questions?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.QUESTIONS.FETCH.PLURAL);
      }

      return await res.json();
    },
  });

  useEffect(() => {
    if (query.isError) {
      showSnackbar(ERROR_MESSAGES.QUESTIONS.FETCH.PLURAL, "danger");
    }
  }, [query.isError, showSnackbar]);

  return query;
};

export const useGetQuestionById = (id: number, enabled = true) => {
  const currentUserId = useCurrentUserId();
  const { showSnackbar } = useSnackbarContext();
  const { ready } = usePrivy();

  const query = useQuery({
    queryKey: ["question", id, currentUserId],
    enabled: enabled && ready && !!id,
    queryFn: async (): Promise<Question> => {
      const params = new URLSearchParams();
      if (currentUserId) params.set("viewerId", String(currentUserId));

      const res = await fetch(`/api/questions/${id}?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.QUESTIONS.FETCH.SINGULAR);
      }

      return await res.json();
    },
  });

  useEffect(() => {
    if (query.isError) {
      showSnackbar(ERROR_MESSAGES.QUESTIONS.FETCH.SINGULAR, "danger");
    }
  }, [query.isError, showSnackbar]);

  return query;
};

export const useGetQuestionAnswers = (id: number, enabled = true) => {
  const currentUserId = useCurrentUserId();
  const { showSnackbar } = useSnackbarContext();
  const { ready } = usePrivy();

  const query = useQuery({
    queryKey: ["questionAnswers", id, currentUserId],
    enabled: enabled && ready && !!id,
    queryFn: async (): Promise<Answer[]> => {
      const params = new URLSearchParams();
      if (currentUserId) params.set("viewerId", String(currentUserId));

      const res = await fetch(`/api/questions/${id}/answers?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.QUESTIONS.FETCH.ANSWERS);
      }

      return await res.json();
    },
  });

  useEffect(() => {
    if (query.isError) {
      showSnackbar(ERROR_MESSAGES.QUESTIONS.FETCH.ANSWERS, "danger");
    }
  }, [query.isError, showSnackbar]);

  return query;
};

export const useCreateQuestion = () => {
  const currentUserId = useCurrentUserId();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async (data: Partial<Question>) => {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: currentUserId }),
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.QUESTIONS.CREATE);
      }

      return await res.json();
    },
    onSuccess: () => {
      showSnackbar(SUCCESS_MESSAGES.QUESTIONS.CREATE, "success");
    },
    onError: () => {
      showSnackbar(ERROR_MESSAGES.QUESTIONS.CREATE, "danger");
    },
  });
};
