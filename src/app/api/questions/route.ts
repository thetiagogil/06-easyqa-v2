import { handleError, jsonResponse, notFound } from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const sort = url.searchParams.get("sort");

    if (id) {
      const { data, error } = await supabase
        .from("questions_with_vote")
        .select("*, user:user_id(*)")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound("Question not found");

      return jsonResponse(data);
    }

    const sortMap: Record<string, string> = {
      top: "vote_score",
      hot: "updated_at",
      new: "created_at",
    };

    const sortBy = sortMap[sort ?? "new"];

    const { data, error } = await supabase
      .from("questions_with_votes")
      .select("*, user:user_id(*)")
      .order(sortBy, { ascending: false });

    if (error) throw error;

    return jsonResponse(data ?? []);
  } catch (error) {
    return handleError(error);
  }
}
