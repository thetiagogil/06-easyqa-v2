import { useQuery } from "@tanstack/react-query";

export const useGetNewQuestions = () => {
  return useQuery({
    queryKey: ["questions", "new"],
    queryFn: async () => {
      const res = await fetch("/api/questions?sort=new");
      return res.json();
    },
  });
};

export const useGetTopQuestions = () => {
  return useQuery({
    queryKey: ["questions", "top"],
    queryFn: async () => {
      const res = await fetch("/api/questions?sort=top");
      return res.json();
    },
  });
};

export const useGetHotQuestions = () => {
  return useQuery({
    queryKey: ["questions", "hot"],
    queryFn: async () => {
      const res = await fetch("/api/questions?sort=hot");
      return res.json();
    },
  });
};
export const useGetQuestionById = (questionId: string) => {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: async () => {
      const res = await fetch(`/api/questions?id=${questionId}`);
      return res.json();
    },
    enabled: !!questionId,
  });
};
