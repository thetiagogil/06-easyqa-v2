import { handleError, jsonResponse } from "@/lib/api-helpers";
import { extractParamsFromUrl } from "@/lib/api-req";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { users: userId } = extractParamsFromUrl(req, ["users"]);

    if (!userId) {
      return jsonResponse({ error: "User ID is required" }, 400);
    }

    const { data, error } = await supabase
      .from("questions")
      .select("*, user:user_id(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return jsonResponse(data ?? []);
  } catch (error) {
    return handleError(error);
  }
}
