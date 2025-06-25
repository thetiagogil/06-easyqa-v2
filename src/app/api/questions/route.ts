import { supabase } from "@/lib/supabase";
import { Vote } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const sort = searchParams.get("sort") ?? "new";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const viewerId = searchParams.get("viewer_id") ?? undefined;

  const sortMap: Record<string, string> = {
    new: "created_at",
    top: "vote_score",
  };

  const orderBy = sortMap[sort] ?? "created_at";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: questions, error } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .order(orderBy, { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let votes: Vote[] = [];

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

    votes = voteRows as unknown as Vote[];
  }

  const response = questions.map((question) => ({
    ...question,
    current_user_vote: votes.find((vote) => vote.target_id === question.id)?.value ?? null,
  }));

  return NextResponse.json(response);
}
