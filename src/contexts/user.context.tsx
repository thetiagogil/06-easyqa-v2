"use client";
import { Loading } from "@/components/shared/loading";
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
  currentUser: UserModel | null;
  authReady: boolean;
  disconnect: () => void;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { address: wallet, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [currentUser, setCurrentUser] = useState<UserModel | null | undefined>(
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
          onError: () => {
            console.error("Error creating user");
            disconnect();
            setCurrentUser(null);
          },
        }
      );
    } else {
      setCurrentUser(null);
    }
  }, [isConnected, wallet, createUser, disconnect]);

  const authReady = isConnected || currentUser !== undefined;

  return (
    <>
      {!authReady && <Loading variant="overlay" />}
      <AuthContext.Provider
        value={{ currentUser: currentUser ?? null, authReady, disconnect }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}

export const useAuthContext = () => useContext(AuthContext);
