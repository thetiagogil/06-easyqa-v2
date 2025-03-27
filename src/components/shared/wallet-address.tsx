import { shortAddress } from "@/lib/utils";
import { IconButton, Stack, Typography, TypographySystem } from "@mui/joy";
import { useState } from "react";
import { IoIosCheckmark, IoIosCopy } from "react-icons/io";

type WalletAddressProps = {
  address: string;
  level?: "inherit" | keyof TypographySystem;
};

export const WalletAddress = ({ address, level }: WalletAddressProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    window.navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography level={level}>{shortAddress(address)}</Typography>
      <IconButton size="sm" onClick={handleCopy}>
        <span
          style={{
            position: "absolute",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.5s ease",
            opacity: copied ? 1 : 0,
          }}
        >
          <IoIosCheckmark fontSize={24} />
        </span>
        <span
          style={{
            transition: "opacity 0.5s ease",
            opacity: copied ? 0 : 1,
          }}
        >
          <IoIosCopy />
        </span>
      </IconButton>
    </Stack>
  );
};
