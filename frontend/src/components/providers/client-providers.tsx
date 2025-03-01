"use client";

import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";
import { ENV_VARS } from "../../lib/constants";
import { theme } from "../../styles/theme";

type ClientProvidersProps = {
  children: ReactNode;
};

const config = getDefaultConfig({
  appName: "easyqa",
  projectId: ENV_VARS.PROJECT_ID,
  chains: [sepolia, anvil],
  ssr: true,
});

const queryClient = new QueryClient();

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <CssVarsProvider defaultMode="light" theme={theme}>
            <CssBaseline />
            {children}
          </CssVarsProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
