import { useAuthContext } from "@/contexts/auth.context";
import { useCreateAnswer } from "@/hooks/useAnswerApi";
import { CHAR_LIMIT, MAIN_BORDERS } from "@/lib/constants";
import { userAvatar, userName } from "@/lib/utils";
import { Avatar, Button, Stack, Textarea, Typography } from "@mui/joy";
import { useForm } from "react-hook-form";

type FormData = { content: string };

export function CreateAnswerForm({ questionId }: { questionId: number }) {
  const { currentUser } = useAuthContext();
  const createAnswer = useCreateAnswer(questionId);

  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  const contentValue = watch("content") ?? "";

  const isMaxed = contentValue.length >= CHAR_LIMIT.ANSWER_CONTENT;
  const isAlmostMaxed = contentValue.length >= CHAR_LIMIT.ANSWER_CONTENT * 0.8;
  const isValidLength = contentValue.length > 0 && contentValue.length <= CHAR_LIMIT.ANSWER_CONTENT;

  const onSubmit = (data: FormData) => {
    if (!isValidLength) return;
    createAnswer.mutate({ content: data.content }, { onSuccess: () => reset() });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack borderBottom={MAIN_BORDERS} p={2} gap={3}>
        <Stack direction="row" alignItems="flex-start" gap={1}>
          <Avatar
            src={userAvatar(currentUser)}
            alt={userName(currentUser)}
            sx={{ width: 32, height: 32, fontSize: 12 }}
          />

          <Textarea
            {...register("content", { required: true })}
            variant="plain"
            placeholder="Write your answer here..."
            minRows={contentValue ? 2 : 1}
            sx={{
              flexGrow: 1,
              fontSize: 14,
              border: "none",
              boxShadow: "none",
              py: 0,
              "& textarea": {
                textAlign: "justify",
                textTransform: "none",
                pt: 0.5,
              },
              "::before": { boxShadow: "none" },
              backgroundColor: "inherit",
            }}
          />
        </Stack>

        {contentValue && (
          <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={1}>
            <Typography
              level="body-sm"
              color={isMaxed ? "danger" : isAlmostMaxed ? "warning" : "neutral"}
            >
              {contentValue.length} / {CHAR_LIMIT.ANSWER_CONTENT}
            </Typography>

            <Button
              type="submit"
              size="sm"
              loading={createAnswer.isPending}
              disabled={!isValidLength}
            >
              Submit
            </Button>
          </Stack>
        )}
      </Stack>
    </form>
  );
}
