import { useAuthContext } from "@/contexts/user.context";
import { getQuestionById, getQuestions } from "@/lib/api/questions";
import { useQuery } from "@tanstack/react-query";

export function useGetQuestions(sort: "new" | "top" | "hot", enabled: boolean) {
  const { currentUser, authReady } = useAuthContext();

  return useQuery({
    queryKey: ["questions", sort, currentUser?.id],
    queryFn: () => getQuestions(sort, currentUser?.id),
    enabled: enabled && authReady,
    staleTime: 30_000,
  });
}

export function useGetQuestionById(questionId: string, enabled = true) {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestionById(questionId),
    enabled: enabled && Boolean(questionId),
    staleTime: 30_000,
  });
}
