import { Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";

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
      <Stack
        bgcolor="background.body"
        width="100%"
        position="sticky"
        top={0}
        alignItems="center"
        p={2}
        borderBottom="solid 1px"
        borderColor="neutral.200"
        zIndex={10}
      >
        <Typography>Navbar</Typography>
      </Stack>

      <Stack flex={1}>{children}</Stack>

      <Stack
        bgcolor="background.body"
        width="100%"
        position="sticky"
        bottom={0}
        alignItems="center"
        p={2}
        borderTop="solid 1px"
        borderColor="neutral.200"
        zIndex={10}
      >
        <Typography>Footer</Typography>
      </Stack>
    </Stack>
  );
};
