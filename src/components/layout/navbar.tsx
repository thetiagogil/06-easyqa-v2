import { useAuthContext } from "@/contexts/auth.context";
import { MAIN_BORDERS } from "@/lib/constants";
import { userAvatar, userName } from "@/lib/utils";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, IconButton, Link, Stack, Typography } from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
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
    borderTop={{ xs: "", sm: MAIN_BORDERS }}
    borderBottom={MAIN_BORDERS}
    py={1}
    px={2}
    zIndex={10}
  >
    {children}
  </Stack>
);

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
  const router = useRouter();

  if (fullItem) return <NavbarContainer>{fullItem}</NavbarContainer>;
  return (
    <NavbarContainer>
      <Stack flexDirection="row" justifyContent="start" alignItems="center" flexBasis="100%">
        {startItem ? (
          startItem
        ) : hasBackButton ? (
          <IconButton
            color="neutral"
            size="sm"
            onClick={() => {
              const internalReferrer = document.referrer.startsWith(window.location.origin);
              if (internalReferrer) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            sx={{ alignSelf: "center" }}
          >
            <ArrowBackIcon />
          </IconButton>
        ) : (
          authenticated && (
            <Avatar
              variant="outlined"
              color="primary"
              src={userAvatar(currentUser)}
              alt={userName(currentUser)}
              component={Link}
              href={`/profile/${currentUser?.id}`}
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
