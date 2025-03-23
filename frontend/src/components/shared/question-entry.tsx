import { getTime, shortAddress } from "@/lib/utils";
import { Avatar, Chip, IconButton, Stack, Typography } from "@mui/joy";
import { useMemo } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

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

          <Typography level="body-md">{question.title}</Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <IconButton size="sm">
                <IoIosArrowUp />
              </IconButton>
              <Typography level="body-sm">0</Typography>
              <IconButton size="sm">
                <IoIosArrowDown />
              </IconButton>
            </Stack>

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
