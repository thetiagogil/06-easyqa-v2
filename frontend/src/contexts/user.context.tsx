"use client";

import { useCreateUserByWallet } from "@/hooks/use-user-api";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

type AuthContextProps = {
  user?: UserModel;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
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
    }
  }, [isConnected, wallet, createUser, disconnect]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
