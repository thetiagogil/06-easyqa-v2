import { supabase } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const questionId = Number(id);
  const { searchParams } = req.nextUrl;
  const viewerId = searchParams.get("viewer_id") ?? undefined;

  if (!questionId) {
    return NextResponse.json({ error: "Missing question ID." }, { status: 400 });
  }

  // Get question and author
  const { data: question, error } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .eq("id", questionId)
    .single();

  if (error || !question) {
    return NextResponse.json({ error: error?.message || "Question not found." }, { status: 404 });
  }

  // Get vote for the question
  let viewer_vote_value: 1 | -1 | null = null;

  if (viewerId) {
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .select("value")
      .eq("user_id", viewerId)
      .eq("target_type", "question")
      .eq("target_id", questionId)
      .maybeSingle();

    if (voteError) {
      return NextResponse.json({ error: voteError.message }, { status: 500 });
    }

    viewer_vote_value = vote?.value ?? null;
  }

  // Get answers with authors
  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select("*, user:user_id(*)")
    .eq("question_id", questionId)
    .order("created_at", { ascending: true });

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  // Get viewer votes for answers (if viewerId is provided)
  if (viewerId && answers.length > 0) {
    const answerIds = answers.map((a) => a.id);

    const { data: answerVotes, error: answerVotesError } = await supabase
      .from("votes")
      .select("target_id, value")
      .eq("user_id", viewerId)
      .eq("target_type", "answer")
      .in("target_id", answerIds);

    if (answerVotesError) {
      return NextResponse.json({ error: answerVotesError.message }, { status: 500 });
    }

    const voteMap = new Map<number, 1 | -1>();
    answerVotes?.forEach((vote) => {
      voteMap.set(vote.target_id, vote.value);
    });

    answers.forEach((answer) => {
      answer.viewer_vote_value = voteMap.get(answer.id) ?? null;
    });
  }

  const response = {
    ...question,
    viewer_vote_value,
    answers,
  };

  return NextResponse.json(response);
}
