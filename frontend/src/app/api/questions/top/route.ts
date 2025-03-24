import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  const { data, error } = await supabase
    .from("questions_with_vote")
    .select("*, user:user_id(*)")
    .order("vote_score", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
