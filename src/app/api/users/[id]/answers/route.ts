import { supabase } from "@/lib/supabase";
import { Question } from "@/types/question";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  const viewerId = req.nextUrl.searchParams.get("viewer_id") ?? undefined;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  const { data: answers, error } = await supabase
    .from("answers")
    .select("question:question_id(*, user:user_id(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!answers) {
    return NextResponse.json([], { status: 200 });
  }

  const questionsMap = new Map<number, Question>();
  (answers as unknown as { question: Question }[]).forEach(({ question }) => {
    if (question && !questionsMap.has(question.id)) {
      questionsMap.set(question.id, question);
    }
  });

  const questions = Array.from(questionsMap.values());

  let viewerVotes: { target_id: number; value: number }[] = [];

  if (viewerId && questions.length) {
    const ids = questions.map((question) => question.id);
    const { data: voteRows, error: voteError } = await supabase
      .from("votes")
      .select("target_id, value")
      .eq("user_id", viewerId)
      .eq("target_type", "question")
      .in("target_id", ids);

    if (voteError) {
      return NextResponse.json({ error: voteError.message }, { status: 500 });
    }

    viewerVotes = voteRows;
  }

  const result = questions.map((question) => ({
    ...question,
    viewer_vote_value: viewerVotes.find((vote) => vote.target_id === question.id)?.value ?? null,
  }));

  return NextResponse.json(result);
}
