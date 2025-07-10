"use client";
import { MainContainer } from "@/components/layout/main-container";
import { Typography } from "@mui/joy";

export default function NotificationsPage() {
  return (
    <MainContainer navbarProps={{ title: "notifications", hasBackButton: true }}>
      <Typography level="h4" mb={2}>
        Notifications
      </Typography>
    </MainContainer>
  );
}
