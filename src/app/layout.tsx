import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/styles/globals.css";
import type { WithChildren } from "@/types";
import { MainProvider } from "../components/providers/main-provider";

export default function RootLayout({ children }: WithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <MainProvider>{children}</MainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
