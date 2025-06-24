"use client";
import { MainContainer } from "@/components/shared/main-container";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, IconButton, Typography } from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";

export default function ProfilePage() {
  const { logout } = usePrivy();

  return (
    <MainContainer navbarProps={{ title: "profile", hasBackButton: true }}>
      <Typography level="h4" mb={2}>
        Profile
      </Typography>

      <Box>
        <IconButton size="sm" color="danger" onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </MainContainer>
  );
}
