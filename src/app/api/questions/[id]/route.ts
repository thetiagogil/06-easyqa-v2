import { apiError } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const questionId = Number(id);

  const { searchParams } = req.nextUrl;
  const searchedParams = Object.fromEntries(searchParams.entries());
  const viewerId = Number(searchedParams.viewerId);

  // Validate required fields
  if (!questionId) {
    return apiError("Missing required fields.", 400);
  }

  // Get question by id
  const { data: question, error: getQuestionError } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .eq("id", questionId)
    .single();

  if (getQuestionError) {
    return apiError(getQuestionError);
  }

  // Get viewerId vote on question
  let viewer_vote_value: 1 | -1 | null = null;

  if (viewerId) {
    const { data: vote, error: getVoteError } = await supabase
      .from("votes")
      .select("value")
      .eq("user_id", viewerId)
      .eq("target_type", "question")
      .eq("target_id", questionId)
      .maybeSingle();

    if (getVoteError) {
      return apiError(getVoteError);
    }

    viewer_vote_value = vote?.value ?? null;
  }

  // Get answers with users destructured
  const { data: answers, error: getAnswersError } = await supabase
    .from("answers")
    .select("*, user:user_id(*)")
    .eq("question_id", questionId)
    .order("created_at", { ascending: true });

  if (getAnswersError) {
    return apiError(getAnswersError);
  }

  // Get viewer votes for answers
  if (viewerId && answers.length > 0) {
    const answerIds = answers.map((a) => a.id);

    const { data: answerVotes, error: getAnswerVotesError } = await supabase
      .from("votes")
      .select("target_id, value")
      .eq("user_id", viewerId)
      .eq("target_type", "answer")
      .in("target_id", answerIds);

    if (getAnswerVotesError) {
      return apiError(getAnswerVotesError);
    }

    const voteMap = new Map<number, 1 | -1>();
    answerVotes?.forEach((vote) => {
      voteMap.set(vote.target_id, vote.value);
    });

    answers.forEach((answer) => {
      answer.viewer_vote_value = voteMap.get(answer.id) ?? null;
    });
  }

  // Return
  const response = {
    ...question,
    viewer_vote_value,
    answers,
  };

  return NextResponse.json(response);
}
