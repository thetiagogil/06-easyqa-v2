"use client";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { useAuthContext } from "@/contexts/user.context";
import { useSubmitVote } from "@/hooks/use-vote-api";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type VoteEntryProps = {
  targetType: "question" | "answer";
  target: {
    id: string;
    vote_score: number;
    current_user_vote: "upvote" | "downvote" | null;
  };
};

export function VoteEntry({ targetType, target }: VoteEntryProps) {
  const { currentUser } = useAuthContext();
  const { showSnackbar } = useSnackbarContext();
  const { mutate: submit } = useSubmitVote();

  const [localScore, setLocalScore] = useState<number>(target.vote_score);
  const [localUserVote, setLocalUserVote] = useState<
    "upvote" | "downvote" | null
  >(target.current_user_vote);

  const handleVoteClick = (selectedType: "upvote" | "downvote") => {
    if (!currentUser) {
      showSnackbar("You must be logged in to vote.", "warning");
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
        userId: currentUser.id,
        targetId: target.id,
        targetType,
        voteType: selectedType,
      },
      {
        onError: () => {
          setLocalScore((prev) => prev - delta);
          setLocalUserVote(target.current_user_vote);
          showSnackbar("Something went wrong. Please try again.", "danger");
        },
      }
    );
  };

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <IconButton
        size="sm"
        variant="outlined"
        color={localUserVote === "upvote" ? "success" : "neutral"}
        onClick={() => handleVoteClick("upvote")}
      >
        <IoIosArrowUp />
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
        variant="outlined"
        color={localUserVote === "downvote" ? "danger" : "neutral"}
        onClick={() => handleVoteClick("downvote")}
      >
        <IoIosArrowDown />
      </IconButton>
    </Stack>
  );
}
