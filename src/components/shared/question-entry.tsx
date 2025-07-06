import { mainBorders } from "@/lib/constants";
import { getTime, userAvatar, userName } from "@/lib/utils";
import { Question } from "@/types";
import { Avatar, Chip, Link, Stack, Typography } from "@mui/joy";
import NextLink from "next/link";
import { useMemo } from "react";
import { VoteEntry } from "./vote-entry";

type QuestionEntryProps = {
  question: Question;
};

export const QuestionEntry = ({ question }: QuestionEntryProps) => {
  const askedAt = useMemo(() => getTime(question.created_at), [question.created_at]);

  return (
    <Stack borderBottom={mainBorders} p={2} gap={1}>
      <Stack direction="row" flexBasis="100%" alignItems="center" gap={1}>
        <Avatar
          src={userAvatar(question.user)}
          alt={userName(question.user)}
          sx={{ width: 32, height: 32, fontSize: 12 }}
        />
        <Typography level="body-sm">
          <Link
            component={NextLink}
            href={`/profile/${question.user?.id}`}
            color="primary"
            fontWeight="bold"
            marginRight={1}
          >
            {userName(question.user)}
          </Link>
          {question ? "asked a question" : "answered"}
        </Typography>
        <Typography level="body-sm" fontSize={10}>
          •
        </Typography>
        <Typography level="body-sm">{askedAt}</Typography>
      </Stack>

      <Stack gap={1}>
        {question && <Typography level="title-sm">{question.title}</Typography>}
        <Typography level="body-sm" textAlign="justify" whiteSpace="pre-line">
          {question.content}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <VoteEntry target={question} targetType="question" />

        <Chip
          variant="outlined"
          color={
            question.status === "open"
              ? "neutral"
              : question.status === "answered"
                ? "success"
                : "neutral"
          }
          disabled={question.status === "closed"}
        >
          {question.status}
        </Chip>
      </Stack>
    </Stack>
  );
};
