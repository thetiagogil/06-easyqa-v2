"use client";
import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { useSubmitVote } from "@/hooks/useVoteApi";
import { Answer } from "@/types/answer";
import { Question } from "@/types/question";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useState } from "react";

type VoteEntryProps = {
  targetType: "question" | "answer";
  target: Question | Answer;
};

export function VoteEntry({ targetType, target }: VoteEntryProps) {
  const { isUserReady } = useAuthContext();
  const { showSnackbar } = useSnackbarContext();
  const { mutate: submit } = useSubmitVote();

  const [localScore, setLocalScore] = useState<number>(target.vote_score);
  const [localUserVote, setLocalUserVote] = useState<"upvote" | "downvote" | null>(
    target.viewer_vote_value === 1 ? "upvote" : target.viewer_vote_value === -1 ? "downvote" : null,
  );

  const handleVoteClick = (selectedType: "upvote" | "downvote") => {
    if (!isUserReady) {
      showSnackbar("You must be logged in to perform this action", "warning");
      return;
    }

    let delta = 0;
    if (localUserVote === selectedType) {
      delta = selectedType === "upvote" ? -1 : +1;
      setLocalUserVote(null);
    } else if (localUserVote === null) {
      delta = selectedType === "upvote" ? +1 : -1;
      setLocalUserVote(selectedType);
    } else {
      delta = selectedType === "upvote" ? +2 : -2;
      setLocalUserVote(selectedType);
    }
    setLocalScore((prev) => prev + delta);

    submit(
      {
        targetId: target.id,
        targetType,
        type: selectedType,
      },
      {
        onError: () => {
          setLocalScore((prev) => prev - delta);
          setLocalUserVote(
            target.viewer_vote_value === 1
              ? "upvote"
              : target.viewer_vote_value === -1
                ? "downvote"
                : null,
          );
          showSnackbar("Something went wrong. Please try again.", "danger");
        },
      },
    );
  };

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <IconButton
        size="sm"
        variant="plain"
        color={localUserVote === "upvote" ? "success" : "neutral"}
        onClick={() => handleVoteClick("upvote")}
      >
        <ArrowUpwardIcon />
      </IconButton>

      <Typography
        level="body-sm"
        sx={{ width: 20, textAlign: "center" }}
        color={
          localUserVote === "upvote"
            ? "success"
            : localUserVote === "downvote"
              ? "danger"
              : "neutral"
        }
      >
        {localScore}
      </Typography>

      <IconButton
        size="sm"
        variant="plain"
        color={localUserVote === "downvote" ? "danger" : "neutral"}
        onClick={() => handleVoteClick("downvote")}
      >
        <ArrowDownwardIcon />
      </IconButton>
    </Stack>
  );
}
