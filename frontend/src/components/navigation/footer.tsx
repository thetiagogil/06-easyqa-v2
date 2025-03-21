import Add from "@mui/icons-material/Add";
import { Button, Link, Stack } from "@mui/joy";
import NextLink from "next/link";
import { GoBell, GoHome, GoKey, GoSearch } from "react-icons/go";

const size = 24;
const footerItems = [
  {
    label: "home",
    path: "/",
    icon: <GoHome size={size} />,
  },
  {
    label: "search",
    path: "/search",
    icon: <GoSearch size={size} />,
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
        <Add />
      </Button>
    ),
  },
  { label: "mint", path: "/mint", icon: <GoKey size={size} /> },
  {
    label: "notifications",
    path: "/notifications",
    icon: <GoBell size={size} />,
  },
];

export const Footer = () => {
  return (
    <Stack
      position="sticky"
      bottom={0}
      bgcolor="background.body"
      borderTop="solid 1px"
      borderBottom="solid 1px"
      borderColor="neutral.200"
      zIndex={10}
    >
      <Stack component="nav" direction="row" py={1}>
        {footerItems.map((item, index) => {
          return (
            <Link
              key={index}
              component={NextLink}
              href={item.path}
              sx={{
                color: "neutral.300",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                "&:hover": {
                  color: "primary.500",
                },
              }}
            >
              {item.icon}
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
};
