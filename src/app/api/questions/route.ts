import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const sort = url.searchParams.get("sort");

  if (id) {
    const { data, error } = await supabase
      .from("questions_with_vote")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  }

  const sortMap: Record<string, string> = {
    top: "vote_score",
    hot: "updated_at",
    new: "created_at",
  };

  const sortBy = sortMap[sort ?? "new"];

  const { data, error } = await supabase
    .from("questions_with_votes")
    .select("*")
    .order(sortBy, { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], { status: 200 });
}
