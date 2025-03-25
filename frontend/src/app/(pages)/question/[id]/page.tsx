"use client";
import { MainContainer } from "@/components/shared/main-container";
import { useGetQuestionById } from "@/hooks/use-question-api";
import { Stack, Typography } from "@mui/joy";
import { useParams } from "next/navigation";

export default function QuestionPage() {
  const { id } = useParams();
  const { data: question } = useGetQuestionById(id as QuestionModel["id"]);

  return (
    <MainContainer navbarProps={{ title: "question", hasBackButton: true }}>
      {question && (
        <Stack p={2} gap={2}>
          <Typography level="body-sm" color="neutral">
            Asked by: {question.user.wallet}
          </Typography>
          <Typography level="h4">{question.title}</Typography>
          <Typography level="body-md">{question.content}</Typography>
        </Stack>
      )}
    </MainContainer>
  );
}
