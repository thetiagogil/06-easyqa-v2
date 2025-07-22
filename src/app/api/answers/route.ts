import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, question_id, content } = body;

  if (!user_id || !question_id || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("answers")
    .insert({ user_id, question_id, content })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get the question owner to notify them
  const { data: question } = await supabase
    .from("questions")
    .select("user_id")
    .eq("id", question_id)
    .single();

  if (question?.user_id && question.user_id !== user_id) {
    await supabase.from("notifications").insert({
      user_id: question.user_id,
      type: "answer_received",
      related_id: data.id,
    });
  }

  return NextResponse.json(data, { status: 201 });
}
