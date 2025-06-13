import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
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
} from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { logout } = usePrivy();
  const router = useRouter();

  const items = [
    {
      label: "Profile",
      icon: <PersonIcon />,
      path: `/profile`,
    },
    { label: "Wallet", icon: <AccountBalanceWalletIcon />, path: "/wallet" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
    { label: "divider" },
    {
      label: "Log out",
      icon: <LogoutIcon />,
      onClick: logout,
    },
  ];

  return (
    <Drawer open={open} onClose={() => setOpen(false)} size="sm">
      <Stack gap={2} p={2}>
        <Avatar />
        <Stack></Stack>
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
          ),
        )}
      </List>
    </Drawer>
  );
};
