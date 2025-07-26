import { apiError } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchedParams = Object.fromEntries(searchParams.entries());
  const limit = Number(searchedParams.limit || 10);
  const offset = Number(searchedParams.offset || 0);
  const search = searchedParams.search;

  // Build query
  let query = supabase.from("users").select("id, name, bio, avatar_url", { count: "exact" });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  query = query.range(offset, offset + limit - 1);

  // Get users with pagination and search
  const { data: users, error: getUsersError } = await query;

  if (getUsersError) {
    return apiError(getUsersError);
  }

  // Return
  return NextResponse.json(users);
}
