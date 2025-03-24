import { useQuery } from "@tanstack/react-query";

export const useGetNewQuestions = () => {
  return useQuery({
    queryKey: ["questions", "new"],
    queryFn: async () => {
      return (await fetch("/api/questions/new")).json();
    },
  });
};

export const useGetTopQuestions = () => {
  return useQuery({
    queryKey: ["questions", "top"],
    queryFn: async () => {
      return (await fetch("/api/questions/top")).json();
    },
  });
};

export const useGetHotQuestions = () => {
  return useQuery({
    queryKey: ["questions", "hot"],
    queryFn: async () => {
      return (await fetch("/api/questions/hot")).json();
    },
  });
};
