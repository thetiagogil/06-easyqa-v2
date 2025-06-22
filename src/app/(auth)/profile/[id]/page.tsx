"use client";
import { MainContainer } from "@/components/shared/main-container";
import { Typography } from "@mui/joy";

export default function ProfilePage() {
  return (
    <MainContainer navbarProps={{ title: "profile", hasBackButton: true }}>
      <Typography level="h4" mb={2}>
        Profile
      </Typography>
    </MainContainer>
  );
}
