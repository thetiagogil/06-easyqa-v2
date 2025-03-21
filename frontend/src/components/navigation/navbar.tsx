import { Avatar, Button, Stack } from "@mui/joy";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

export const Navbar = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  return (
    <Stack
      component="nav"
      position="sticky"
      top={0}
      bgcolor="background.body"
      height={56}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      borderTop="solid 1px"
      borderBottom="solid 1px"
      borderColor="neutral.200"
      py={1}
      px={2}
      zIndex={10}
    >
      <Avatar />

      {isConnected ? (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            onClick={() => disconnect()}
            variant="solid"
            color="danger"
            size="sm"
          >
            Disconnect
          </Button>
        </Stack>
      ) : (
        <Button onClick={openConnectModal} variant="solid" size="sm">
          Connect Wallet
        </Button>
      )}
    </Stack>
  );
};
