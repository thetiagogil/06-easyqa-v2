import { fetchQuestionById, fetchQuestions } from "@/lib/api/questions";
import { useQuery } from "@tanstack/react-query";

type QueryOptions = { enabled?: boolean };

export const useGetNewQuestions = (options: QueryOptions = {}) =>
  useQuery({
    queryKey: ["questions", "new"],
    queryFn: () => fetchQuestions("new"),
    ...options,
  });

export const useGetTopQuestions = (options: QueryOptions = {}) =>
  useQuery({
    queryKey: ["questions", "top"],
    queryFn: () => fetchQuestions("top"),
    ...options,
  });

export const useGetHotQuestions = (options: QueryOptions = {}) =>
  useQuery({
    queryKey: ["questions", "hot"],
    queryFn: () => fetchQuestions("hot"),
    ...options,
  });

export const useGetQuestionById = (questionId: string) =>
  useQuery({
    queryKey: ["question", questionId],
    queryFn: () => fetchQuestionById(questionId),
    enabled: !!questionId,
  });
