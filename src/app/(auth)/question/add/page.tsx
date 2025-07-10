"use client";
import { MainContainer } from "@/components/layout/main-container";
import { Typography } from "@mui/joy";

export default function QuestionAddPage() {
  return (
    <MainContainer navbarProps={{ title: "add question", hasBackButton: true }}>
      <Typography level="h4" mb={2}>
        Add question
      </Typography>
    </MainContainer>
  );
}
