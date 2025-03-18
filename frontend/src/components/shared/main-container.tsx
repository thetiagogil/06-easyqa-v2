import { Stack } from "@mui/joy";
import { ReactNode } from "react";
import { useAccount } from "wagmi";
import { Footer } from "../navigation/footer";
import { Navbar } from "../navigation/navbar";

type MainContainerProps = {
  children: ReactNode;
};

export const MainContainer = ({ children }: MainContainerProps) => {
  const { isConnected } = useAccount();
  return (
    <Stack
      position="relative"
      minHeight="100vh"
      width={{ xs: "100%", sm: 500 }}
      justifySelf="center"
      border="solid 1px"
      borderColor="neutral.200"
    >
      <Navbar />
      <Stack flex={1}>{children}</Stack>
      {isConnected && <Footer />}
    </Stack>
  );
};
