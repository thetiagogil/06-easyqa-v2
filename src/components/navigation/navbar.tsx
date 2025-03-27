import { AuthContext } from "@/contexts/user.context";
import { userAvatar, userName } from "@/lib/utils";
import { Avatar, IconButton, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { ReactNode, useContext, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Sidebar } from "./sidebar";

export type NavbarProps = {
  title?: string;
  hasBackButton?: boolean;
  startItem?: ReactNode;
  centerItem?: ReactNode;
  endItem?: ReactNode;
  fullItem?: ReactNode;
};

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
  const router = useRouter();
  return (
    <IconButton onClick={() => router.push("/")}>
      <IoIosArrowBack />
    </IconButton>
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
  const { currentUser } = useContext(AuthContext);
  const [open, setOpen] = useState<boolean>(false);

  if (fullItem) return <NavbarContainer>{fullItem}</NavbarContainer>;
  return (
    <NavbarContainer>
      <Sidebar open={open} setOpen={setOpen} />
      <Stack
        flexDirection="row"
        justifyContent="start"
        alignItems="center"
        flexBasis="100%"
      >
        {startItem ? (
          startItem
        ) : hasBackButton ? (
          <BackButton />
        ) : (
          <Avatar
            src={userAvatar(currentUser)}
            alt={userName(currentUser)}
            onClick={() => setOpen(true)}
            sx={{ cursor: "pointer" }}
          />
        )}
      </Stack>

      <Stack
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        flexBasis="100%"
      >
        {centerItem ? (
          centerItem
        ) : (
          <Typography level="body-md">{title}</Typography>
        )}
      </Stack>

      <Stack
        flexDirection="row"
        justifyContent="end"
        alignItems="center"
        flexBasis="100%"
      >
        {endItem ? endItem : <></>}
      </Stack>
    </NavbarContainer>
  );
};
