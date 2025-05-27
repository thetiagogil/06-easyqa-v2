import { getTime, userAvatar, userName } from "@/lib/utils";
import { Avatar, Chip, Link, Stack, Typography } from "@mui/joy";
import NextLink from "next/link";
import { useMemo } from "react";
import { VoteEntry } from "./vote-entry";

type QuestionEntryProps = {
  question: QuestionModel;
};

export const QuestionEntry = ({ question }: QuestionEntryProps) => {
  const askedAt = useMemo(
    () => getTime(question.created_at),
    [question.created_at]
  );
  const sharedHeight = 24;

  return (
    <Stack borderBottom="1px solid" p={2}>
      <Stack direction="row" gap={1}>
        <Stack>
          <Avatar
            src={userAvatar(question.user)}
            alt={userName(question.user)}
            sx={{ height: sharedHeight, width: sharedHeight }}
          />
        </Stack>

        <Stack flexBasis="100%" gap={1}>
          <Stack
            direction="row"
            height={sharedHeight}
            alignItems="center"
            gap={1}
          >
            <Typography level="body-sm">
              <Link
                component={NextLink}
                href={`/profile/${question.user?.id}`}
                color="primary"
                fontWeight="bold"
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
          >
            <Typography level="body-md">{question.title}</Typography>
          </Link>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <VoteEntry target={question} targetType="question" />

            <Chip
              variant="outlined"
              color={question.status === "closed" ? "neutral" : "primary"}
            >
              {question.status}
            </Chip>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
