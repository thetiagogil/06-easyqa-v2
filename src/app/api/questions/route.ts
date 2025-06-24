import { supabase } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const sortKey = searchParams.get("sort") ?? "new";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const userId = searchParams.get("user_id") ?? undefined;

  const sortMap: Record<string, string> = {
    new: "created_at",
    top: "vote_score",
  };

  const orderByColumn = sortMap[sortKey] ?? "created_at";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 1 - Fetch questions with author info
  const { data: questionRows, error: listError } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .order(orderByColumn, { ascending: false })
    .range(from, to);

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  // 2 - Fetch current user votes on questions
  let viewerVotes: { target_id: number; value: number }[] = [];

  if (userId && questionRows?.length) {
    const questionIds = questionRows.map((q) => q.id);
    const { data: voteRows, error: voteError } = await supabase
      .from("votes")
      .select("target_id, value")
      .eq("user_id", userId)
      .eq("target_type", "question")
      .in("target_id", questionIds);

    if (voteError) {
      return NextResponse.json({ error: voteError.message }, { status: 500 });
    }

    viewerVotes = voteRows;
  }

  // 3 - Merge current_user_vote with question data
  const responseData = questionRows.map((q) => ({
    ...q,
    current_user_vote: viewerVotes.find((v) => v.target_id === q.id)?.value ?? null,
  }));

  return NextResponse.json(responseData);
}
