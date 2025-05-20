import { fetchQuestionById, fetchQuestions } from "@/lib/api/questions";
import { useQuery } from "@tanstack/react-query";

export const useGetNewQuestions = () =>
  useQuery({
    queryKey: ["questions", "new"],
    queryFn: () => fetchQuestions("new"),
  });

export const useGetTopQuestions = () =>
  useQuery({
    queryKey: ["questions", "top"],
    queryFn: () => fetchQuestions("top"),
  });

export const useGetHotQuestions = () =>
  useQuery({
    queryKey: ["questions", "hot"],
    queryFn: () => fetchQuestions("hot"),
  });

export const useGetQuestionById = (questionId: string) =>
  useQuery({
    queryKey: ["question", questionId],
    queryFn: () => fetchQuestionById(questionId),
    enabled: !!questionId,
  });
