"use client";
import { Stack } from "@mui/joy";
import { ReactNode } from "react";
import { Footer } from "../layout/footer";
import { Navbar } from "../layout/navbar";

type MainContainerProps = {
  children: ReactNode;
  navbarProps?: object;
};

export const MainContainer = ({ children, navbarProps }: MainContainerProps) => {
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
      <Stack component="main" flexGrow={1}>
        {children}
      </Stack>
      <Footer />
    </Stack>
  );
};
