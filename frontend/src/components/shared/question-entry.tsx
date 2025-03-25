import { getTime, shortAddress } from "@/lib/utils";
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
            src=""
            alt={question.user?.name}
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
              <strong>
                {question.user?.name
                  ? question.user?.name
                  : shortAddress(question.user?.wallet)}{" "}
              </strong>
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
            <VoteEntry questionId={question.id} />

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
