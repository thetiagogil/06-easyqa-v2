import { supabase } from "@/lib/supabase";
import { Vote } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const sort = searchParams.get("sort") ?? "new";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const viewerId = searchParams.get("viewer_id") ?? undefined;

  const sortMap: Record<string, string> = {
    new: "created_at",
    top: "vote_score",
  };

  const orderBy = sortMap[sort] ?? "created_at";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: questions, error } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .order(orderBy, { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!questions?.length) return NextResponse.json([]);

  const questionIds = questions.map((question) => question.id);

  const { data: answers, error: answerError } = await supabase
    .from("answers")
    .select("question_id")
    .in("question_id", questionIds);

  if (answerError) {
    return NextResponse.json({ error: answerError.message }, { status: 500 });
  }

  const answerCountMap = new Map<number, number>();
  answers?.forEach((answer) => {
    answerCountMap.set(answer.question_id, (answerCountMap.get(answer.question_id) || 0) + 1);
  });

  let votes: Vote[] = [];

  if (viewerId) {
    const ids = questions.map((question) => question.id);
    const { data: voteRows, error: voteError } = await supabase
      .from("votes")
      .select("target_id, value")
      .eq("user_id", viewerId)
      .eq("target_type", "question")
      .in("target_id", ids);

    if (voteError) {
      return NextResponse.json({ error: voteError.message }, { status: 500 });
    }

    votes = voteRows as unknown as Vote[];
  }

  const response = questions.map((question) => ({
    ...question,
    viewer_vote_value: votes.find((vote) => vote.target_id === question.id)?.value ?? null,
    answer_count: answerCountMap.get(question.id) ?? 0,
  }));

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, title, content } = body;

  if (!user_id || !title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("questions")
    .insert([{ user_id, title, content }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
