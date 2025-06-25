import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { mainBorders } from "@/lib/constants";
import { getTime, userAvatar, userName } from "@/lib/utils";
import { Question } from "@/types/question";
import { Avatar, Chip, Link, Stack, Typography } from "@mui/joy";
import NextLink from "next/link";
import { useMemo } from "react";
import { VoteEntry } from "./vote-entry";

type QuestionEntryProps = {
  question: Question;
  isLastQuestion: boolean;
};

export const QuestionEntry = ({ question, isLastQuestion }: QuestionEntryProps) => {
  const { isUserReady } = useAuthContext();
  const { showSnackbar } = useSnackbarContext();

  const askedAt = useMemo(() => getTime(question.created_at), [question.created_at]);
  const sharedHeight = 24;

  const handleVoteClick = (e: any) => {
    if (!isUserReady) {
      e.preventDefault();
      showSnackbar("You must be logged in to perform this action", "warning");
      return;
    }
  };

  return (
    <Stack borderBottom={isLastQuestion ? "" : mainBorders} p={2}>
      <Stack direction="row" gap={1}>
        <Stack>
          <Avatar
            src={userAvatar(question.user)}
            alt={userName(question.user)}
            sx={{ height: sharedHeight, width: sharedHeight }}
          />
        </Stack>

        <Stack flexBasis="100%" gap={1}>
          <Stack direction="row" height={sharedHeight} alignItems="center" gap={1}>
            <Typography level="body-sm">
              <Link
                component={NextLink}
                href={!isUserReady ? "#" : `/profile/${question.user?.id}`}
                color="primary"
                fontWeight="bold"
                onClick={(e) => handleVoteClick(e)}
              >
                {userName(question.user)}
              </Link>{" "}
              asked a question
            </Typography>
            <Typography level="body-sm" fontSize={10}>
              •
            </Typography>
            <Typography level="body-sm">{askedAt}</Typography>
          </Stack>

          <Link
            component={NextLink}
            href={`/question/${question.id}`}
            underline="none"
            onClick={(e) => handleVoteClick(e)}
          >
            <Typography level="body-md">{question.title}</Typography>
          </Link>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <VoteEntry target={question} targetType="question" />

            <Chip
              variant="outlined"
              color={question.status === "open" ? "primary" : "neutral"}
              disabled={question.status === "closed"}
            >
              {question.status}
            </Chip>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
