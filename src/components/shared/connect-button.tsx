import { Button } from "@mui/joy";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const ConnectButton = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  return (
    !isConnected && (
      <Button onClick={openConnectModal} variant="solid" size="sm">
        Connect Wallet
      </Button>
    )
  );
};
