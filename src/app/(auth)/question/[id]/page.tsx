"use client";
import { MainContainer } from "@/components/shared/main-container";
import { Typography } from "@mui/joy";

export default function QuestionPage() {
  return (
    <MainContainer navbarProps={{ title: "question", hasBackButton: true }}>
      <Typography level="h4" mb={2}>
        Question
      </Typography>
    </MainContainer>
  );
}
