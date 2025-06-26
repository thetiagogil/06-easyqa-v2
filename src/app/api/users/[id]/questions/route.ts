import { supabase } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  const viewerId = req.nextUrl.searchParams.get("viewer_id") ?? undefined;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  const { data: questions, error } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let viewerVotes: { target_id: number; value: number }[] = [];

  if (viewerId && questions?.length) {
    const ids = questions.map((q) => q.id);
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
    current_user_vote: viewerVotes.find((vote) => vote.target_id === question.id)?.value ?? null,
  }));

  return NextResponse.json(result);
}
