import { useQuery } from "@tanstack/react-query";

export const useGetQuestions = () => {
  return useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const res = await fetch("/api/questions");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
  });
};
