import { Avatar, Button, Stack } from "@mui/joy";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

export const Navbar = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  return (
    <Stack
      bgcolor="background.body"
      width="100%"
      position="sticky"
      top={0}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      borderBottom="solid 1px"
      borderColor="neutral.200"
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
