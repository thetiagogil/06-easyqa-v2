import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const answerId = Number(id);
  const body = await req.json();
  const userId = body?.user_id;

  if (!answerId || !userId) {
    return NextResponse.json({ error: "Missing answer ID or user ID" }, { status: 400 });
  }

  // Fetch the answer with its associated question
  const { data: answer, error: fetchError } = await supabase
    .from("answers")
    .select("id, question_id")
    .eq("id", answerId)
    .single();

  if (fetchError || !answer) {
    return NextResponse.json({ error: fetchError?.message || "Answer not found" }, { status: 404 });
  }

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("id, user_id")
    .eq("id", answer.question_id)
    .single();

  if (questionError || !question) {
    return NextResponse.json(
      { error: questionError?.message || "Question not found" },
      { status: 404 },
    );
  }

  // Validate that current user is the question owner
  if (question.user_id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Accept the answer and close the question
  const { error: updateAnswerError } = await supabase
    .from("answers")
    .update({ accepted: true })
    .eq("id", answerId);

  if (updateAnswerError) {
    return NextResponse.json({ error: updateAnswerError.message }, { status: 500 });
  }

  const { error: updateQuestionError } = await supabase
    .from("questions")
    .update({ status: "closed" })
    .eq("id", answer.question_id)
    .select()
    .single();

  if (updateQuestionError) {
    console.error("Question update error:", updateQuestionError.message);
    return NextResponse.json({ error: updateQuestionError.message }, { status: 500 });
  }

  // Find the author of the accepted answer
  const { data: acceptedAnswer } = await supabase
    .from("answers")
    .select("user_id")
    .eq("id", answerId)
    .single();

  if (acceptedAnswer?.user_id && acceptedAnswer.user_id !== userId) {
    await supabase.from("notifications").insert({
      user_id: acceptedAnswer.user_id,
      type: "answer_accepted",
      related_id: answer.question_id,
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
