"use client";
import { MainContainer } from "@/components/shared/main-container";
import { useGetQuestionById } from "@/hooks/useQuestionApi";
import { Stack, Typography } from "@mui/joy";
import { useParams } from "next/navigation";

export default function QuestionPage() {
  const { id } = useParams();
  const { data: question } = useGetQuestionById(Number(id));

  return (
    <MainContainer navbarProps={{ title: "question", hasBackButton: true }}>
      {question && (
        <Stack gap={2}>
          <Typography level="body-sm" color="neutral">
            Asked by: {question?.user?.name}
          </Typography>
          <Typography level="h4">{question.title}</Typography>
          <Typography level="body-md" textAlign="justify">
            {question.content}
          </Typography>
        </Stack>
      )}
    </MainContainer>
  );
}
