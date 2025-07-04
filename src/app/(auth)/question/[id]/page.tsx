"use client";
import { Loading } from "@/components/shared/loading";
import { MainContainer } from "@/components/shared/main-container";
import { QuestionEntry } from "@/components/shared/question-entry";
import { TargetEntry } from "@/components/shared/target-entry";
import { useAuthContext } from "@/contexts/auth.context";
import { useCreateAnswer } from "@/hooks/useAnswerApi";
import { useGetQuestionById } from "@/hooks/useQuestionApi";
import { mainBorders } from "@/lib/constants";
import { userAvatar, userName } from "@/lib/utils";
import { Avatar, Button, Stack, Textarea } from "@mui/joy";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

type FormData = {
  content: string;
};

export default function QuestionPage() {
  const { id } = useParams();
  const questionId = Number(id);
  const { currentUser } = useAuthContext();
  const { data: question, isPending: isPendingQuestion } = useGetQuestionById(Number(id));
  const createAnswer = useCreateAnswer(questionId);
  const { register, handleSubmit, reset } = useForm<FormData>();

  if (isPendingQuestion) return <Loading variant="overlay" />;
  if (!question) return null;

  const hasAlreadyAnswered = question.answers?.find((answer) => {
    return answer.user_id === currentUser?.id;
  });

  const onSubmit = (data: FormData) => {
    if (!data.content.trim()) return;

    createAnswer.mutate(
      { content: data.content },
      {
        onSuccess: () => reset(),
      },
    );
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack borderBottom={mainBorders} direction="row" alignItems="flex-start" p={2} gap={1}>
        <Avatar
          src={userAvatar(currentUser)}
          alt={userName(currentUser)}
          sx={{ width: 32, height: 32, fontSize: 12 }}
        />

        <Textarea
          {...register("content")}
          variant="plain"
          placeholder="Write your answer here..."
          minRows={4}
          sx={{
            fontSize: "0.875rem",
            flexGrow: 1,
            border: "none",
            boxShadow: "none",
            "::before": {
              boxShadow: "none",
            },
            "&>*": {
              textTransform: "none",
            },
            backgroundColor: "inherit",
          }}
        />

        <Button type="submit" loading={createAnswer.isPending}>
          Submit
        </Button>
      </Stack>
    </form>
  );

  return (
    <MainContainer navbarProps={{ title: "question", hasBackButton: true }} noPad>
      {<QuestionEntry question={question} />}
      {!hasAlreadyAnswered && currentUser?.id !== question.user_id && renderForm()}
      {question.answers?.map((answer, index) => {
        return (
          <TargetEntry
            key={answer.id}
            targetType="answer"
            target={answer}
            isLastTarget={index === (question.answers && question.answers.length - 1)}
            canAccept={currentUser?.id === question.user_id}
          />
        );
      })}
    </MainContainer>
  );
}
