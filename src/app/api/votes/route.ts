import { supabase } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const {
    user_id: userId,
    target_id: targetId,
    target_type: targetType,
    type: voteType,
  } = requestBody;

  if (!userId || !targetId || !targetType || !voteType) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  if (!["question", "answer"].includes(targetType)) {
    return NextResponse.json(
      { error: "Target type must be 'question' or 'answer'." },
      { status: 400 },
    );
  }

  if (!["upvote", "downvote"].includes(voteType)) {
    return NextResponse.json(
      { error: "Vote type must be 'upvote' or 'downvote'." },
      { status: 400 },
    );
  }

  const voteValue = voteType === "upvote" ? 1 : -1;

  // 1 - Fetch existing vote
  const { data: existingVote, error: findError } = await supabase
    .from("votes")
    .select("id, value")
    .eq("user_id", userId)
    .eq("target_id", targetId)
    .eq("target_type", targetType)
    .maybeSingle();

  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }

  // 2 - Handle CRUD logic
  if (existingVote) {
    if (existingVote.value === voteValue) {
      // Remove vote
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ message: "Vote removed." });
    } else {
      // Update vote
      const { error: updateError } = await supabase
        .from("votes")
        .update({ value: voteValue })
        .eq("id", existingVote.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ message: "Vote updated." });
    }
  } else {
    // Insert new vote
    const { error: insertError } = await supabase.from("votes").insert({
      user_id: userId,
      target_id: targetId,
      target_type: targetType,
      value: voteValue,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Vote submitted." });
  }
}
