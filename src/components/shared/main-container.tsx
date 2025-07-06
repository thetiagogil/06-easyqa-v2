"use client";
import { mainBorders } from "@/lib/constants";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { Footer } from "../layout/footer";
import { Navbar } from "../layout/navbar";

interface MainContainerProps {
  children: ReactNode;
  navbarProps?: object;
  noPad?: boolean;
  sx?: SxProps;
}

export const MainContainer = ({ children, navbarProps, noPad, sx }: MainContainerProps) => {
  return (
    <Stack
      position="sticky"
      top={0}
      minHeight="100vh"
      maxWidth={{ xs: "100%", sm: 500 }}
      borderRight={{ xs: "", sm: mainBorders }}
      borderLeft={{ xs: "", sm: mainBorders }}
      margin="auto"
    >
      <Navbar {...navbarProps} />
      <Stack component="main" flexGrow={1} p={noPad ? 0 : 2} sx={sx}>
        {children}
      </Stack>
      <Footer />
    </Stack>
  );
};
