import "@/styles/globals.css";
import type { WithChildren } from "@/types";
import { Providers } from "../components/providers";

export default function RootLayout({ children }: WithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
