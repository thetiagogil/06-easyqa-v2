import { ENV_VARS } from "@/lib/constants";
import { theme } from "@/styles/theme";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "easyqa",
  projectId: ENV_VARS.PROJECT_ID,
  chains: [sepolia, anvil],
  ssr: true,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <CssVarsProvider defaultMode="light" theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </CssVarsProvider>{" "}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
