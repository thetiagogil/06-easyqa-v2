"use client";
import { AuthContextProvider } from "@/contexts/auth.context";
import { ENV_VARS } from "@/lib/constants";
import { theme } from "@/styles/theme";
import type { WithChildren } from "@/types";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import type { PrivyClientConfig } from "@privy-io/react-auth";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const queryClient = new QueryClient();

const privy: { appId: string; config: PrivyClientConfig } = {
  appId: ENV_VARS.PRIVY_APP_ID!,
  config: {
    loginMethods: ["wallet", "email", "google"],
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
  },
};

export function Providers({ children }: WithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <PrivyProvider appId={privy.appId} config={privy.config}>
      <QueryClientProvider client={queryClient}>
        <CssVarsProvider defaultMode="dark" theme={theme}>
          <CssBaseline />
          <AuthContextProvider>{children}</AuthContextProvider>
        </CssVarsProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
