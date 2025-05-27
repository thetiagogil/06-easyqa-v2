import { handleError, jsonResponse } from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const sortKey = searchParams.get("sort") ?? "new";
    const userId = searchParams.get("user_id") ?? null;
    const sortMap: Record<string, string> = {
      new: "created_at",
      top: "vote_score",
      hot: "updated_at",
    };
    const orderByColumn = sortMap[sortKey] ?? "created_at";

    // 1 - Get a page of questions with vote_score
    const { data: questionRows, error: listError } = await supabase
      .from("questions_with_votes")
      .select("*, user:user_id(*)")
      .order(orderByColumn, { ascending: false });
    if (listError) throw listError;

    // 2 - If the caller is authenticated, get their votes in a single query
    let viewerVotes: { target_id: string; type: string }[] = [];
    if (userId && questionRows?.length) {
      const questionIds = questionRows.map((q) => q.id);
      const { data: voteRows, error: voteFetchError } = await supabase
        .from("votes")
        .select("target_id, type")
        .eq("user_id", userId)
        .in("target_id", questionIds);
      if (voteFetchError) throw voteFetchError;
      viewerVotes = voteRows;
    }

    // 3 - Merge in current_user_vote for each question
    const responseData = (questionRows ?? []).map((q) => ({
      ...q,
      current_user_vote:
        viewerVotes.find((v) => v.target_id === q.id)?.type ?? null,
    }));

    return jsonResponse(responseData);
  } catch (caughtError) {
    return handleError(caughtError);
  }
}
