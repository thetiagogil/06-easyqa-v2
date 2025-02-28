import "@/styles/globals.css";
import { theme } from "@/styles/theme";
import { CssBaseline } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider defaultMode="light" theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </CssVarsProvider>
  );
}
