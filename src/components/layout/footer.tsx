import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HomeIcon from "@mui/icons-material/Home";
import KeyIcon from "@mui/icons-material/Key";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Link, Stack } from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

const size = 24;

const footerItems = [
  {
    label: "home",
    path: "/",
    icon: <HomeIcon sx={{ fontSize: size }} />,
  },
  {
    label: "search",
    path: "/search",
    icon: <SearchIcon sx={{ fontSize: size }} />,
  },
  {
    label: "question",
    path: "/question/add",
    icon: (
      <Button
        sx={{
          height: 48,
          width: 48,
          borderRadius: 24,
          boxShadow: "0px 0px 16px 0px #7ADC9E",
        }}
      >
        <AddRoundedIcon />
      </Button>
    ),
  },
  {
    label: "mint",
    path: "/mint",
    icon: <KeyIcon sx={{ fontSize: size }} />,
  },
  {
    label: "notifications",
    path: "/notifications",
    icon: <NotificationsIcon sx={{ fontSize: size }} />,
  },
];

export const Footer = () => {
  const pathname = usePathname();
  const { authenticated } = usePrivy();

  return (
    <>
      {authenticated && (
        <Stack
          position="sticky"
          bottom={0}
          bgcolor="background.body"
          borderTop="solid 1px"
          borderBottom="solid 1px"
          zIndex={10}
        >
          <Stack component="nav" direction="row" py={1}>
            {footerItems.map((item, index) => (
              <Link
                key={index}
                component={NextLink}
                href={item.path}
                sx={{
                  color: pathname === item.path ? "primary.500" : "neutral.400",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    color: "primary.700",
                  },
                }}
              >
                {item.icon}
              </Link>
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};
