import { userAvatar, userName } from "@/lib/utils";
import { Avatar, IconButton, Stack, Typography } from "@mui/joy";
import { IoPencilOutline } from "react-icons/io5";

type ProfileOverviewProps = {
  user?: UserModel;
};

export const ProfileOverview = ({ user }: ProfileOverviewProps) => {
  return (
    <Stack p={2} gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Avatar
          size="lg"
          src={userAvatar(user)}
          alt={userName(user)}
          sx={{ height: 80, width: 80 }}
        />

        <Stack>
          <IconButton variant="outlined" size="sm">
            <IoPencilOutline />
          </IconButton>
        </Stack>
      </Stack>

      <Typography level="h2">{userName(user)}</Typography>

      <Typography level="body-sm">{user?.bio}</Typography>
    </Stack>
  );
};
