import ClientProviders from "@/components/providers/client-providers";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
