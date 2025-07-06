import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { mainBorders } from "@/lib/constants";
import { getTime, userAvatar, userName } from "@/lib/utils";
import { Answer, Question } from "@/types";
import { Avatar, Button, Chip, Link, Stack, Typography } from "@mui/joy";
import NextLink from "next/link";
import { useMemo } from "react";
import { VoteEntry } from "./vote-entry";

type TargetEntryProps = {
  targetType: "question" | "answer";
  target: Question | Answer;
  isLastTarget: boolean;
  canAccept?: boolean;
};

export const TargetEntry = ({ targetType, target, isLastTarget, canAccept }: TargetEntryProps) => {
  const { isUserReady } = useAuthContext();
  const { showSnackbar } = useSnackbarContext();

  const question = targetType === "question" ? (target as Question) : null;
  const answer = targetType === "answer" ? (target as Answer) : null;

  const askedAt = useMemo(() => getTime(target.created_at), [target.created_at]);
  const sharedHeight = 24;

  const handleVoteClick = (e: any) => {
    if (!isUserReady) {
      e.preventDefault();
      showSnackbar("You must be logged in to perform this action", "warning");
      return;
    }
  };

  return (
    <Stack direction="row" borderBottom={isLastTarget ? "" : mainBorders} p={2} gap={1}>
      <Stack>
        <Avatar
          src={userAvatar(target.user)}
          alt={userName(target.user)}
          sx={{ height: sharedHeight, width: sharedHeight, fontSize: 12 }}
        />
      </Stack>

      <Stack flexBasis="100%" gap={1}>
        <Stack direction="row" height={sharedHeight} alignItems="center" gap={1}>
          <Typography level="body-sm">
            <Link
              component={NextLink}
              href={!isUserReady ? "#" : `/profile/${target.user?.id}`}
              color="primary"
              fontWeight="bold"
              onClick={handleVoteClick}
              underline="none"
              marginRight={1}
            >
              {userName(target.user)}
            </Link>
            {question ? "asked" : "answered"}
          </Typography>
          <Typography level="body-sm" fontSize={10}>
            •
          </Typography>
          <Typography level="body-sm">{askedAt}</Typography>
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
          <VoteEntry targetType={targetType} target={target} />

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
              {answer.accepted}
            </Chip>
          )}

          {answer && canAccept && question?.status !== "closed" && (
            <Button variant="outlined" color="neutral" size="sm">
              Accept answer
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
