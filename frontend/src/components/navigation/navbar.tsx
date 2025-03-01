import { Stack } from "@mui/joy";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Navbar = () => {
  return (
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
      <ConnectButton
        label="sign in"
        chainStatus="icon"
        accountStatus="avatar"
        showBalance={true}
      />
    </Stack>
  );
};
