"use client";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { useAuthContext } from "@/contexts/user.context";
import {
  useCreateAndUpdateVote,
  useGetVotesByTargetId,
} from "@/hooks/use-vote-api";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type VoteEntryProps = {
  target: QuestionModel | AnswerModel;
  target_type: "question" | "answer";
};

export const VoteEntry = ({ target, target_type }: VoteEntryProps) => {
  // STATES
  const { currentUser } = useAuthContext();
  const { showSnackbar } = useSnackbarContext();
  const { data: votes } = useGetVotesByTargetId(target.id);
  const { mutate: vote } = useCreateAndUpdateVote();

  const [localScore, setLocalScore] = useState(target.vote_score);
  const [localUserVote, setLocalUserVote] = useState<
    "upvote" | "downvote" | null
  >(null);

  // FUNCTIONS
  const handleVote = (clickedType: "upvote" | "downvote") => {
    if (!currentUser) {
      showSnackbar("You must be logged in to vote.");
      return;
    }

    const prevType = localUserVote;
    let delta = 0;

    if (prevType === clickedType) {
      delta = clickedType === "upvote" ? -1 : +1;
      setLocalUserVote(null);
    } else if (prevType === null) {
      delta = clickedType === "upvote" ? +1 : -1;
      setLocalUserVote(clickedType);
    } else {
      delta = clickedType === "upvote" ? +2 : -2;
      setLocalUserVote(clickedType);
    }

    setLocalScore((s) => s + delta);

    vote(
      {
        user_id: currentUser.id,
        target_id: target.id,
        target_type,
        type: clickedType,
      },
      {
        onError: () => {
          setLocalScore((s) => s - delta);
          setLocalUserVote(prevType);
          showSnackbar("Something went wrong. Please try again.");
        },
      }
    );
  };

  // MEMOIZED
  const { upvoteCount, downvoteCount, userVoteType } = useMemo(() => {
    if (!votes || !currentUser) {
      return { upvoteCount: 0, downvoteCount: 0, userVoteType: null };
    }

    const upvoteCount = votes.filter(
      (vote: VotesModel) => vote.type === "upvote"
    ).length;
    const downvoteCount = votes.filter(
      (vote: VotesModel) => vote.type === "downvote"
    ).length;
    const userVote =
      votes.find((vote: VotesModel) => vote.user_id === currentUser.id)?.type ??
      null;

    return {
      upvoteCount,
      downvoteCount,
      userVoteType: userVote as "upvote" | "downvote" | null,
    };
  }, [votes, currentUser]);

  // EFFECTS
  useEffect(() => {
    setLocalScore(upvoteCount - downvoteCount);
    setLocalUserVote(userVoteType);
  }, [upvoteCount, downvoteCount, userVoteType]);

  // RENDER
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <IconButton
        size="sm"
        variant="outlined"
        onClick={() => handleVote("upvote")}
        color={localUserVote === "upvote" ? "success" : "neutral"}
      >
        <IoIosArrowUp />
      </IconButton>

      <Typography
        level="body-sm"
        color={
          localUserVote === "upvote"
            ? "success"
            : localUserVote === "downvote"
            ? "danger"
            : "neutral"
        }
        sx={{ width: 20, textAlign: "center" }}
      >
        {localScore}
      </Typography>

      <IconButton
        size="sm"
        variant="outlined"
        onClick={() => handleVote("downvote")}
        color={localUserVote === "downvote" ? "danger" : "neutral"}
      >
        <IoIosArrowDown />
      </IconButton>
    </Stack>
  );
};
