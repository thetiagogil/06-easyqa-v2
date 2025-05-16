import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, target_id, target_type, type } = body;

  if (!user_id || !target_id || !target_type || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", user_id)
    .eq("target_id", target_id)
    .eq("target_type", target_type)
    .single();

  if (existingVote) {
    if (existingVote.type === type) {
      await supabase.from("votes").delete().eq("id", existingVote.id);
    } else {
      await supabase.from("votes").update({ type }).eq("id", existingVote.id);
    }
  } else {
    await supabase.from("votes").insert({
      user_id,
      target_id,
      target_type,
      type,
    });
  }

  return NextResponse.json({ success: true });
}
