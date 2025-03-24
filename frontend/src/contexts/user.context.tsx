"use client";
import { useCreateUserByWallet } from "@/hooks/use-user-api";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

export const AuthContext = createContext({} as { user?: UserModel });

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { address: wallet, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [user, setUser] = useState<UserModel | undefined>(undefined);

  const { mutate: createUser } = useCreateUserByWallet();

  useEffect(() => {
    if (isConnected && wallet) {
      createUser(
        { wallet },
        {
          onSuccess: (data) => {
            setUser(data.user || data);
          },
          onError: (createError) => {
            console.error("Error creating user:", createError);
            disconnect();
          },
        }
      );
    } else {
      setUser(undefined);
    }
  }, [isConnected, wallet, createUser, disconnect]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
