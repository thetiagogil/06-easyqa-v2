import { AuthContext } from "@/contexts/user.context";
import { userAvatar, userName } from "@/lib/utils";
import {
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { useContext, useMemo } from "react";
import {
  IoLogOutOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { useDisconnect } from "wagmi";
import { WalletAddress } from "../shared/wallet-address";

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { currentUser } = useContext(AuthContext);
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const wallet = currentUser?.wallet;

  const items = useMemo(
    () => [
      {
        label: "Profile",
        icon: <IoPersonOutline />,
        path: `/profile/${currentUser?.id}`,
      },
      { label: "Wallet", icon: <IoWalletOutline />, path: "/wallet" },
      { label: "Settings", icon: <IoSettingsOutline />, path: "/settings" },
      { label: "divider" },
      {
        label: "Log out",
        icon: <IoLogOutOutline />,
        onClick: () => disconnect(),
      },
    ],
    [currentUser]
  );

  return (
    <Drawer open={open} onClose={() => setOpen(false)} size="sm">
      <Stack gap={2} p={2}>
        <Avatar src={userAvatar(currentUser)} alt={userName(currentUser)} />
        <Stack>
          {currentUser?.name ? (
            <Typography level="h3">{currentUser?.name}</Typography>
          ) : (
            <WalletAddress address={wallet!} level="h3" />
          )}
          {currentUser?.name && (
            <WalletAddress address={currentUser?.wallet} level="body-sm" />
          )}
        </Stack>
      </Stack>
      <List>
        {items.map((item) =>
          item.label === "divider" ? (
            <Divider key={item.label} sx={{ my: 1 }} />
          ) : (
            <ListItem key={item.label} variant="plain">
              <ListItemButton
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.path) {
                    router.push(item.path);
                  }
                  setOpen(false);
                }}
              >
                <ListItemDecorator>{item.icon}</ListItemDecorator>
                <ListItemContent>{item.label}</ListItemContent>
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Drawer>
  );
};
