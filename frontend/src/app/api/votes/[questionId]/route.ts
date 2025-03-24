import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = params;

  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("target_id", questionId)
    .eq("target_type", "question");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
