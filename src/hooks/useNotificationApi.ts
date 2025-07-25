import { useAuthContext } from "@/contexts/auth.context";
import { NOTIFICATIONS_PAGE_SIZE } from "@/lib/constants";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetNotifications = () => {
  const { currentUser } = useAuthContext();

  return useInfiniteQuery({
    queryKey: ["notifications", "infinite", currentUser?.id],
    enabled: !!currentUser?.id,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.set("user_id", String(currentUser!.id));
      params.set("limit", String(NOTIFICATIONS_PAGE_SIZE));
      params.set("offset", String(pageParam * NOTIFICATIONS_PAGE_SIZE));

      const res = await fetch(`/api/notifications?${params}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch notifications");
      }

      return await res.json();
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === NOTIFICATIONS_PAGE_SIZE ? allPages.length : undefined,
  });
};

export const useGetUnreadNotificationsCount = () => {
  const { currentUser } = useAuthContext();

  return useQuery({
    queryKey: ["notifications", "unreadCount", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return 0;
      const res = await fetch(`/api/notifications/unread-count?user_id=${currentUser.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch count");
      return data;
    },
    enabled: !!currentUser?.id,
  });
};

export const useReadAllNotifications = () => {
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!currentUser?.id) return;
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        body: JSON.stringify({ user_id: currentUser.id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to mark as read");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
    },
  });
};
