import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("answers")
    .select("question:question_id(*, user:user_id(*))")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const questions = data.map((item) => item.question);
  return NextResponse.json(questions ?? []);
}
