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

  const hasAlreadyAnswered =
    !question?.answers?.find((answer) => answer.user_id === currentUser?.id) &&
    currentUser?.id !== question?.user_id;

  return (
    <MainContainer navbarProps={{ title: "question", hasBackButton: true }} noPad>
      {isPendingQuestion ? (
        <Loading />
      ) : !question ? null : (
        <>
          <QuestionEntry question={question} />
          {hasAlreadyAnswered && <CreateAnswerForm questionId={question.id} />}
          {question.answers?.map((answer) => (
            <TargetEntry
              key={answer.id}
              targetType="answer"
              target={answer}
              answeredQuestion={question}
            />
          ))}
        </>
      )}
    </MainContainer>
  );
}
