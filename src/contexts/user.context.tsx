"use client";
import { useCreateUserByWallet } from "@/hooks/use-user-api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useDisconnect } from "wagmi";

type AuthContextType = {
  currentUser?: UserModel;
  isLoading: boolean;
  disconnect: () => void;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { address: wallet, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: createUser } = useCreateUserByWallet();

  useEffect(() => {
    if (isConnected && wallet) {
      setIsLoading(true);
      createUser(
        { wallet },
        {
          onSuccess: (data) => {
            setCurrentUser(data.user || data);
            setIsLoading(false);
          },
          onError: (createError) => {
            console.error("Error creating user:", createError);
            disconnect();
            setIsLoading(false);
          },
        }
      );
    } else {
      setCurrentUser(undefined);
      setIsLoading(false);
    }
  }, [isConnected, wallet, createUser, disconnect]);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, disconnect }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
