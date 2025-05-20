"use client";
import { SnackbarProvider } from "@/contexts/snackbar.context";
import { AuthContextProvider } from "@/contexts/user.context";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";

export const ClientProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <RainbowKitProvider>
      <SnackbarProvider>
        <AuthContextProvider>{children}</AuthContextProvider>
      </SnackbarProvider>
    </RainbowKitProvider>
  );
};
