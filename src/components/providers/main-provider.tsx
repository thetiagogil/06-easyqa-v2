"use client";
import { AuthContextProvider } from "@/contexts/auth.context";
import { SnackbarProvider, useSnackbarContext } from "@/contexts/snackbar.context";
import { ENV_VARS } from "@/lib/constants";
import type { WithChildren } from "@/types";
import type { PrivyClientConfig } from "@privy-io/react-auth";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const queryClient = new QueryClient();

const validateEnvVars = () => {
  const missing = Object.entries(ENV_VARS)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  return missing;
};

const EnvValidator = () => {
  const { showSnackbar } = useSnackbarContext();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const missing = validateEnvVars();

    if (missing.length > 0) {
      showSnackbar(`Missing ENV vars: ${missing.join(", ")}`, "warning");
    }
  }, [showSnackbar]);

  return null;
};

const privy: { appId: string; config: PrivyClientConfig } = {
  appId: ENV_VARS.PRIVY_APP_ID,
  config: {
    loginMethods: ["wallet", "email", "google"],
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
  },
};

export function MainProvider({ children }: WithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SnackbarProvider>
      <PrivyProvider appId={privy.appId} config={privy.config}>
        <QueryClientProvider client={queryClient}>
          <EnvValidator />
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </SnackbarProvider>
  );
}
