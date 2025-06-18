import { useSnackbarContext } from "@/contexts/snackbar.context"; // ✅ import your context
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  const { ready, authenticated } = usePrivy();
  const { showSnackbar } = useSnackbarContext();

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
        const error = await res.json();
        showSnackbar(error.message || "Failed to authenticate user", "danger");
        return null;
      }

      const data = await res.json();
      return data;
    },
    enabled: ready && authenticated,
    retry: false,
  });
};
