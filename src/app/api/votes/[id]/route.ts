import { handleError, jsonResponse } from "@/lib/api-helpers";
import { extractParamsFromUrl } from "@/lib/api-req";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { votes: targetId } = extractParamsFromUrl(req, ["votes"]);

    if (!targetId) {
      return jsonResponse({ error: "Target ID is required" }, 400);
    }

    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .eq("target_id", targetId)
      .eq("target_type", "question");

    if (error) throw error;

    return jsonResponse(data ?? []);
  } catch (error) {
    return handleError(error);
  }
}
