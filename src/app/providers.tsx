"use client";
import { AuthContextProvider, useAuthContext } from "@/contexts/auth.context";
import { SnackbarProvider, useSnackbarContext } from "@/contexts/snackbar.context";
import { ENV_VARS } from "@/lib/constants";
import { theme } from "@/styles/theme";
import type { WithChildren } from "@/types";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import type { PrivyClientConfig } from "@privy-io/react-auth";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "../components/shared/loading";

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

const AuthWrapper = () => {
  const { currentUser } = useAuthContext();
  const { ready, authenticated } = usePrivy();
  const { showSnackbar } = useSnackbarContext();
  const router = useRouter();
  const pathname = usePathname();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated && pathname !== "/") {
      showSnackbar("You must be logged in to perform this action", "warning");
      setTimeout(() => router.replace("/"), 50);
      return;
    }

    if (authenticated && !currentUser) return;

    if (authenticated && currentUser && !currentUser.name && pathname !== "/setup") {
      setTimeout(() => router.replace("/setup"), 50);
      return;
    }

    if (authenticated && currentUser?.name && pathname === "/setup") {
      setTimeout(() => router.replace("/"), 50);
      return;
    }

    setRedirecting(false);
  }, [ready, authenticated, currentUser, pathname, router]);

  if (redirecting || !ready || (authenticated && !currentUser)) {
    return <Loading variant="overlay" />;
  }

  return null;
};

const MountedWrapper = ({ children }: WithChildren) => {
  return (
    <SnackbarProvider>
      <PrivyProvider appId={privy.appId} config={privy.config}>
        <EnvValidator />
        <AuthContextProvider>
          <AuthWrapper />
          {children}
        </AuthContextProvider>
      </PrivyProvider>
    </SnackbarProvider>
  );
};

export const Providers = ({ children }: WithChildren) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <CssVarsProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        {mounted && <MountedWrapper>{children}</MountedWrapper>}
      </QueryClientProvider>
    </CssVarsProvider>
  );
};
