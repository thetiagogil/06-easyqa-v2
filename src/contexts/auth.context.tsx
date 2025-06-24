"use client";
import { Loading } from "@/components/shared/loading";
import { useAuthUser } from "@/hooks/useAuthApi";
import { WithChildren } from "@/types";
import type { User } from "@/types/user";
import { usePrivy } from "@privy-io/react-auth";
import { createContext, useContext, useMemo } from "react";

interface AuthContextType {
  currentUser: User | null;
  isUserReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isUserReady: false,
});

export function AuthContextProvider({ children }: WithChildren) {
  const { ready, authenticated, user: privyUser } = usePrivy();
  const { data: userData } = useAuthUser();

  const value = useMemo(() => {
    const mergedUser: User | null =
      userData && privyUser
        ? {
            ...userData,
            email: privyUser.email?.address,
            wallet: privyUser.wallet?.address,
          }
        : null;

    const isUserReady = ready && (authenticated ? !!mergedUser?.name : true);

    return {
      currentUser: mergedUser,
      isUserReady,
    };
  }, [ready, authenticated, userData, privyUser]);

  if (!ready) return <Loading variant="overlay" />;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
