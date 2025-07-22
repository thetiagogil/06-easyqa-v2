import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { follower_id, following_id } = await req.json();

  if (!follower_id) {
    return NextResponse.json({ error: "Missing follower_id." }, { status: 400 });
  }

  if (!following_id) {
    return NextResponse.json({ error: "Missing following_id." }, { status: 400 });
  }

  if (follower_id === following_id) {
    return NextResponse.json({ error: "You cannot follow yourself." }, { status: 400 });
  }

  const { count, error: countError } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", follower_id)
    .eq("following_id", following_id);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if (count && count > 0) {
    return NextResponse.json({ error: "Already following." }, { status: 409 });
  }

  const { error } = await supabase
    .from("follows")
    .insert([{ follower_id, following_id, followed_at: new Date().toISOString() }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("notifications").insert({
    user_id: following_id,
    type: "followed",
    related_id: follower_id,
  });

  return NextResponse.json({ message: "Followed successfully." });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const follower_id = searchParams.get("follower_id");
  const following_id = searchParams.get("following_id");

  if (!follower_id) {
    return NextResponse.json({ error: "Missing follower_id." }, { status: 400 });
  }

  if (!following_id) {
    return NextResponse.json({ error: "Missing following_id." }, { status: 400 });
  }

  const { error } = await supabase.from("follows").delete().match({ follower_id, following_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("notifications").delete().match({
    user_id: following_id,
    type: "followed",
    related_id: follower_id,
  });

  return NextResponse.json({ message: "Unfollowed successfully." });
}
