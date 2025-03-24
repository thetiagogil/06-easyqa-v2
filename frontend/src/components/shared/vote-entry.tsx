import { useSnackbar } from "@/contexts/snackbar.context";
import { AuthContext } from "@/contexts/user.context";
import {
  useCreateAndUpdateVote,
  useGetVotesByQuestionId,
} from "@/hooks/use-vote-api";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useContext, useMemo } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type VoteEntryProps = {
  questionId: QuestionModel["id"];
};

export const VoteEntry = ({ questionId }: VoteEntryProps) => {
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const { data: votes } = useGetVotesByQuestionId(questionId);
  const { mutate: vote } = useCreateAndUpdateVote();

  const userVote = useMemo(() => {
    return user && votes?.find((vote: any) => vote.user_id === user?.id);
  }, [votes, user]);

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!user) {
      showSnackbar("You must be logged in to vote.");
    } else {
      vote({
        user_id: user?.id || 0,
        target_id: questionId,
        target_type: "question",
        type,
      });
    }
  };

  const score =
    votes?.reduce(
      (acc: number, v: any) => acc + (v.type === "upvote" ? 1 : -1),
      0
    ) ?? 0;

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <IconButton
        size="sm"
        variant="outlined"
        onClick={() => handleVote("upvote")}
        color={userVote?.type === "upvote" ? "success" : "neutral"}
      >
        <IoIosArrowUp />
      </IconButton>
      <Typography
        level="body-sm"
        color={
          userVote?.type === "upvote"
            ? "success"
            : userVote?.type === "downvote"
            ? "danger"
            : "neutral"
        }
        sx={{ width: 20, textAlign: "center" }}
      >
        {score}
      </Typography>
      <IconButton
        size="sm"
        variant="outlined"
        onClick={() => handleVote("downvote")}
        color={userVote?.type === "downvote" ? "danger" : "neutral"}
      >
        <IoIosArrowDown />
      </IconButton>
    </Stack>
  );
};
