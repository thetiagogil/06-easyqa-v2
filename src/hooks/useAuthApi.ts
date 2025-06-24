import { useSnackbarContext } from "@/contexts/snackbar.context";
import { User } from "@/types/user";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = (enabled = true) => {
  const { logout } = usePrivy();
  const { showSnackbar } = useSnackbarContext();

  return useQuery({
    queryKey: ["user"],
    enabled,
    queryFn: async (): Promise<User> => {
      const token = await getAccessToken();
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        const message = error.message || "Failed to authenticate user";
        showSnackbar(message, "danger");
        await logout();
        throw new Error(message);
      }

      return await res.json();
    },
    retry: false,
  });
};
