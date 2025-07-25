import { apiError } from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchedParams = Object.fromEntries(searchParams.entries());
  const limit = Number(searchedParams.limit || 10);
  const offset = Number(searchedParams.offset || 0);
  const search = searchedParams.search;

  // Get users with pagination and search
  let query = supabase.from("users").select("id, name, bio, avatar_url", { count: "exact" });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  query = query.range(offset, offset + limit - 1);

  const { data: users, error: getUsersError } = await query;

  if (getUsersError) {
    return apiError(getUsersError);
  }

  return NextResponse.json(users);
}
