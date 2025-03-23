"use client";
import { AuthContextProvider } from "@/contexts/user.context";
import { ENV_VARS } from "@/lib/constants";
import { theme } from "@/styles/theme";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "easyqa",
  projectId: ENV_VARS.PROJECT_ID,
  chains: [sepolia, anvil],
  ssr: true,
});

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);
  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <CssBaseline />
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {mounted && (
            <RainbowKitProvider>
              <AuthContextProvider>{children}</AuthContextProvider>
            </RainbowKitProvider>
          )}
        </QueryClientProvider>
      </WagmiProvider>
    </CssVarsProvider>
  );
};
