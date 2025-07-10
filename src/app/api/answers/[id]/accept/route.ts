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

  console.log("Attempting to update question:", answer.question_id);

  const { data: updatedQuestion, error: updateQuestionError } = await supabase
    .from("questions")
    .update({ status: "closed" })
    .eq("id", answer.question_id)
    .select()
    .single();

  if (updateQuestionError) {
    console.error("Question update error:", updateQuestionError.message);
    return NextResponse.json({ error: updateQuestionError.message }, { status: 500 });
  }

  console.log("Updated question:", updatedQuestion);

  return NextResponse.json({ success: true }, { status: 200 });
}
