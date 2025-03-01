import { Stack } from "@mui/joy";
import { ReactNode } from "react";
import { Footer } from "../navigation/footer";
import { Navbar } from "../navigation/navbar";

type MainContainerProps = {
  children: ReactNode;
};

export const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <Stack
      position="relative"
      minHeight="100vh"
      width={500}
      justifySelf="center"
      border="solid 1px"
      borderColor="neutral.200"
    >
      <Navbar />
      <Stack flex={1}>{children}</Stack>
      <Footer />
    </Stack>
  );
};
