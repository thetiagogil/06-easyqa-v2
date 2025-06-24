"use client";
import { MainContainer } from "@/components/shared/main-container";
import { Typography } from "@mui/joy";

export default function SearchPage() {
  return (
    <MainContainer navbarProps={{ title: "search", hasBackButton: true }}>
      <Typography level="h4" mb={2}>
        Search
      </Typography>
    </MainContainer>
  );
}
