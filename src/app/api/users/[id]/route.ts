import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  const viewerId = req.nextUrl.searchParams.get("viewer_id") ?? undefined;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }
  const { data: user, error } = await supabase.from("users").select().eq("id", userId).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  let isViewerFollowing = false;
  if (viewerId && viewerId !== userId) {
    const { count, error: followError } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", viewerId)
      .eq("following_id", userId);

    if (!followError && count && count > 0) {
      isViewerFollowing = true;
    }
  }

  return NextResponse.json({
    ...user,
    isViewerFollowing,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  if (!id || !body || typeof body !== "object") {
    return NextResponse.json({ error: "Missing user ID or data." }, { status: 400 });
  }

  const { error } = await supabase.from("users").update(body).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "User updated successfully." });
}
