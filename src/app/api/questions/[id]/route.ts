import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const userId = req.nextUrl.searchParams.get("user_id") ?? undefined;

  if (!id) {
    return NextResponse.json({ error: "Missing question ID." }, { status: 400 });
  }

  const { data: question, error } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .eq("id", id)
    .single();

  if (error || !question) {
    return NextResponse.json({ error: error?.message || "Question not found." }, { status: 404 });
  }

  let currentUserVote: 1 | -1 | undefined = undefined;
  if (userId) {
    const { data: vote } = await supabase
      .from("votes")
      .select("value")
      .eq("target_id", id)
      .eq("target_type", "question")
      .eq("user_id", userId)
      .maybeSingle();

    currentUserVote = vote?.value;
  }

  return NextResponse.json({
    ...question,
    current_user_vote: currentUserVote,
  });
}
