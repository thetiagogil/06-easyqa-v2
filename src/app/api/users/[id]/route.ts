import { apiError } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);

  const { searchParams } = new URL(req.url);
  const searchedParams = Object.fromEntries(searchParams.entries());
  const viewerId = Number(searchedParams.viewerId);

  // Validate required fields
  if (!userId) {
    return apiError("Missing required fields.", 400);
  }

  // Get user by id
  const { data: user, error: getUserError } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();

  if (getUserError) {
    return apiError(getUserError);
  }

  if (!user) {
    return apiError("User not found", 404);
  }

  // Get follow value from viewer
  let isViewerFollowing = false;

  if (viewerId && viewerId !== userId) {
    const { count: followCount, error: getFollowError } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", viewerId)
      .eq("following_id", userId);

    if (!getFollowError && followCount && followCount > 0) {
      isViewerFollowing = true;
    }
  }

  // Return
  return NextResponse.json({
    ...user,
    isViewerFollowing,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;

  const body = await req.json();

  // Validate required fields
  if (!userId) {
    return apiError("Missing required fields.", 400);
  }

  // Update user
  const { error: updateUserError } = await supabase.from("users").update(body).eq("id", userId);

  if (updateUserError) {
    return apiError(updateUserError);
  }

  // Return
  return NextResponse.json({ message: "User updated successfully." });
}
