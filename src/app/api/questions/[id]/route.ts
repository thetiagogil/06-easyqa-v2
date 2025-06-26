import { supabase } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  const viewerId = req.nextUrl.searchParams.get("user_id") ?? undefined;

  if (!userId) {
    return NextResponse.json({ error: "Missing question ID." }, { status: 400 });
  }

  const { data: question, error } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .eq("id", userId)
    .single();

  if (error || !question) {
    return NextResponse.json({ error: error?.message || "Question not found." }, { status: 404 });
  }

  let currentUserVote: 1 | -1 | null = null;

  if (viewerId) {
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .select("value")
      .eq("target_id", userId)
      .eq("target_type", "question")
      .eq("user_id", viewerId)
      .maybeSingle();

    if (voteError) {
      return NextResponse.json({ error: voteError.message }, { status: 500 });
    }

    currentUserVote = vote?.value ?? null;
  }

  const response = {
    ...question,
    current_user_vote: currentUserVote,
  };

  return NextResponse.json(response);
}
