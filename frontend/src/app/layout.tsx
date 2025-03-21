"use client";
import { MainContainer } from "@/components/shared/main-container";
import "@/styles/globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <MainContainer>{children}</MainContainer>
        </Providers>
      </body>
    </html>
  );
}
