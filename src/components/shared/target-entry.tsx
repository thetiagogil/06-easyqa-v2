import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { useAcceptAnswer } from "@/hooks/useAnswerApi";
import { MAIN_BORDERS } from "@/lib/constants";
import { userName } from "@/lib/utils";
import { Answer, Question } from "@/types";
import { Button, Chip, Link, Stack, Typography } from "@mui/joy";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NextLink from "next/link";
import { useMemo } from "react";
import { CustomAvatar } from "./custom-avatar";
import { VoteEntry } from "./vote-entry";

dayjs.extend(relativeTime);

type TargetEntryProps = {
  targetType: "question" | "answer";
  target: Question | Answer;
  answeredQuestion?: Question;
};

export const TargetEntry = ({ targetType, target, answeredQuestion }: TargetEntryProps) => {
  const { isUserReady } = useAuthContext();
  const { showSnackbar } = useSnackbarContext();
  const { currentUser } = useAuthContext();

  const question = targetType === "question" ? (target as Question) : null;
  const answer = targetType === "answer" ? (target as Answer) : null;

  const canAccept = currentUser?.id === answeredQuestion?.user_id;
  const acceptAnswer =
    targetType === "answer" && answeredQuestion ? useAcceptAnswer(answeredQuestion.id) : null;
  const askedAt = useMemo(() => dayjs(target.created_at).fromNow(), [target.created_at]);
  const isClosed =
    (targetType === "question" && question?.status === "closed") ||
    (targetType === "answer" && answeredQuestion?.status === "closed");
  const notAcceptedAnswer =
    targetType === "answer" && answeredQuestion?.status === "closed" && !answer?.accepted;

  const sharedSize = 24;

  const handleVoteClick = (e: any) => {
    if (!isUserReady) {
      e.preventDefault();
      showSnackbar("You must be logged in to perform this action", "warning");
    }
  };

  const handleAccept = () => {
    console.log(answer?.id);
    console.log(acceptAnswer);
    if (!answer?.id || !acceptAnswer) return;
    acceptAnswer.mutate(answer.id);
  };

  return (
    <Stack
      direction="row"
      borderBottom={MAIN_BORDERS}
      p={2}
      gap={1}
      sx={notAcceptedAnswer ? { opacity: 0.5 } : undefined}
    >
      <Stack>
        <CustomAvatar user={target.user} size={sharedSize} fontSize={12} />
      </Stack>

      <Stack flexBasis="100%" gap={1}>
        <Stack direction="row" height={sharedSize} alignItems="center" gap={1}>
          <Typography level="body-sm">
            <Link
              component={NextLink}
              href={!isUserReady ? "#" : `/profile/${target.user?.id}`}
              color="primary"
              fontWeight="bold"
              onClick={handleVoteClick}
              marginRight={1}
            >
              {userName(target.user)}
            </Link>
            {question ? "asked" : "answered"}
          </Typography>
          <Typography level="body-sm" textColor="neutral.600" fontSize={10}>
            •
          </Typography>
          <Typography level="body-sm" textColor="neutral.600">
            {askedAt}
          </Typography>
        </Stack>

        {question ? (
          <Link
            component={NextLink}
            href={`/question/${question.id}`}
            underline="none"
            onClick={(e) => handleVoteClick(e)}
          >
            <Typography level="body-md">{question.title}</Typography>
          </Link>
        ) : (
          <Typography level="body-sm" textAlign="justify" whiteSpace="pre-line">
            {target.content}
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <VoteEntry targetType={targetType} target={target} isClosed={isClosed} />

          {question && (
            <Chip
              variant="outlined"
              color={question.status === "open" ? "primary" : "neutral"}
              disabled={question.status === "closed"}
            >
              {question.status}
            </Chip>
          )}

          {answer && answer.accepted && (
            <Chip variant="outlined" color="success">
              Accepted
            </Chip>
          )}

          {answer && canAccept && answeredQuestion?.status !== "closed" && (
            <Button
              variant="outlined"
              color="neutral"
              size="sm"
              loading={acceptAnswer?.isPending}
              onClick={handleAccept}
            >
              Accept answer
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
