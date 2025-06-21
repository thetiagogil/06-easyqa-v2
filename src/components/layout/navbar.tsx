import { useAuthContext } from "@/contexts/auth.context";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Link, Stack, Typography } from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";
import NextLink from "next/link";
import { ReactNode } from "react";

interface NavbarProps {
  title?: string;
  hasBackButton?: boolean;
  startItem?: ReactNode;
  centerItem?: ReactNode;
  endItem?: ReactNode;
  fullItem?: ReactNode;
}

const NavbarContainer = ({ children }: { children: ReactNode }) => (
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
    py={1}
    px={2}
    zIndex={10}
  >
    {children}
  </Stack>
);

const BackButton = () => {
  return (
    <Link
      color="neutral"
      component={NextLink}
      href="/"
      sx={{
        "&:hover": {
          color: "neutral.600",
        },
      }}
    >
      <ArrowBackIcon />
    </Link>
  );
};

export const Navbar = ({
  title,
  startItem,
  centerItem,
  endItem,
  fullItem,
  hasBackButton,
}: NavbarProps) => {
  const { authenticated } = usePrivy();
  const { currentUser } = useAuthContext();

  if (fullItem) return <NavbarContainer>{fullItem}</NavbarContainer>;
  return (
    <NavbarContainer>
      <Stack flexDirection="row" justifyContent="start" alignItems="center" flexBasis="100%">
        {startItem ? (
          startItem
        ) : hasBackButton ? (
          <BackButton />
        ) : (
          authenticated && (
            <Avatar
              variant="outlined"
              color="primary"
              src=""
              alt={currentUser?.name}
              component={Link}
              href="/profile"
              underline="none"
            />
          )
        )}
      </Stack>

      <Stack flexDirection="row" justifyContent="center" alignItems="center" flexBasis="100%">
        {centerItem ? centerItem : <Typography level="body-md">{title}</Typography>}
      </Stack>

      <Stack flexDirection="row" justifyContent="end" alignItems="center" flexBasis="100%">
        {endItem ?? <></>}
      </Stack>
    </NavbarContainer>
  );
};
