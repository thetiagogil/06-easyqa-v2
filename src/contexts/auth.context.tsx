"use client";
import { Loading } from "@/components/shared/loading";
import { useAuthUser } from "@/hooks/useAuth";
import { WithChildren } from "@/types";
import type { UserType } from "@/types/user";
import { usePrivy } from "@privy-io/react-auth";
import { createContext, useContext, useMemo } from "react";

type AuthContextType = {
  currentUser: UserType | null;
  loading: boolean;
  isUserReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isUserReady: false,
});

export function AuthContextProvider({ children }: WithChildren) {
  const { ready, user: privyUser } = usePrivy();
  const { data: userData, isLoading } = useAuthUser();

  const loading = !ready || (isLoading && !!privyUser);

  const value = useMemo(() => {
    const mergedUser: UserType | null =
      userData && privyUser
        ? {
            ...userData,
            email: privyUser.email?.address,
            wallet: privyUser.wallet?.address,
          }
        : null;
    const isUserReady = !!privyUser && !!userData && !!userData.name;

    return {
      currentUser: mergedUser,
      loading,
      isUserReady,
    };
  }, [userData, privyUser, loading]);

  if (loading) return <Loading minHeight="100vh" />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
