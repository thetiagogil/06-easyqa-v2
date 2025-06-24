"use client";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { Footer } from "../layout/footer";
import { Navbar } from "../layout/navbar";

interface MainContainerProps {
  children: ReactNode;
  navbarProps?: object;
  hasTabs?: boolean;
  sx?: SxProps;
}

export const MainContainer = ({ children, navbarProps, hasTabs, sx }: MainContainerProps) => {
  return (
    <Stack
      position="sticky"
      top={0}
      minHeight="100vh"
      maxWidth={{ xs: "100%", sm: 500 }}
      borderRight="1px solid"
      borderLeft="1px solid"
      margin="auto"
    >
      <Navbar {...navbarProps} />
      <Stack component="main" flexGrow={1} p={hasTabs ? 0 : 2} sx={sx}>
        {children}
      </Stack>
      <Footer />
    </Stack>
  );
};
