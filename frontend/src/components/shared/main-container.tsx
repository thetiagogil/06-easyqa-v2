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
      position="sticky"
      top={0}
      minHeight="100vh"
      maxWidth={{ xs: "100%", sm: 500 }}
      borderRight="1px solid"
      borderLeft="1px solid"
      margin="auto"
    >
      <Navbar />
      <Stack component="main" flexGrow={1}>
        {children}
      </Stack>
      {isConnected && <Footer />}
    </Stack>
  );
};
