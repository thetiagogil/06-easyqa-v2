import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  const { ready, authenticated } = usePrivy();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await getAccessToken();
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to authenticate user");
      }

      return res.json();
    },
    enabled: ready && authenticated,
    retry: false,
  });
};
