"use client";
import { ENV_VARS } from "@/lib/constants";
import { theme } from "@/styles/theme";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";
import { ClientProviders } from "./client.providers";

const config = getDefaultConfig({
  appName: "easyqa",
  projectId: ENV_VARS.PROJECT_ID,
  chains: [sepolia, anvil],
  ssr: true,
});

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <CssVarsProvider defaultMode="dark" theme={theme}>
    <CssBaseline />
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ClientProviders>{children}</ClientProviders>
      </QueryClientProvider>
    </WagmiProvider>
  </CssVarsProvider>
);
