"use client";
import { MainContainer } from "@/components/layout/main-container";
import { CreateAnswerForm } from "@/components/shared/create-answer-form";
import { Loading } from "@/components/shared/loading";
import { QuestionEntry } from "@/components/shared/question-entry";
import { TargetEntry } from "@/components/shared/target-entry";
import { useAuthContext } from "@/contexts/auth.context";
import { useGetQuestionById } from "@/hooks/useQuestionApi";
import { useParams } from "next/navigation";

export default function QuestionPage() {
  const { id } = useParams();
  const { currentUser } = useAuthContext();
  const { data: question, isPending: isPendingQuestion } = useGetQuestionById(Number(id));

  if (isPendingQuestion) return <Loading variant="overlay" />;
  if (!question) return null;

  const hasAlreadyAnswered = question.answers?.find((answer) => {
    return answer.user_id === currentUser?.id;
  });

  return (
    <MainContainer navbarProps={{ title: "question", hasBackButton: true }} noPad>
      {<QuestionEntry question={question} />}
      {!hasAlreadyAnswered && currentUser?.id !== question.user_id && (
        <CreateAnswerForm questionId={question.id} />
      )}
      {question.answers?.map((answer) => {
        return (
          <TargetEntry
            key={answer.id}
            targetType="answer"
            target={answer}
            answeredQuestion={question}
          />
        );
      })}
    </MainContainer>
  );
}
