"use client";
import { useCreateUserByWallet } from "@/hooks/use-user-api";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

type AuthContextType = {
  currentUser?: UserModel;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { address: wallet, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(
    undefined
  );

  const { mutate: createUser } = useCreateUserByWallet();

  useEffect(() => {
    if (isConnected && wallet) {
      createUser(
        { wallet },
        {
          onSuccess: (data) => {
            setCurrentUser(data.user || data);
          },
          onError: (createError) => {
            console.error("Error creating user:", createError);
            disconnect();
          },
        }
      );
    } else {
      setCurrentUser(undefined);
    }
  }, [isConnected, wallet, createUser, disconnect]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
