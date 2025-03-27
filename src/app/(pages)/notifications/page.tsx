"use client";
import { MainContainer } from "@/components/shared/main-container";

export default function NotificationsPage() {
  return (
    <MainContainer
      navbarProps={{ title: "notifications", hasBackButton: true }}
    >
      Notifications
    </MainContainer>
  );
}
