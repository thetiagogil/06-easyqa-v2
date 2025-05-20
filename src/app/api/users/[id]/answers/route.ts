import { handleError, jsonResponse } from "@/lib/api-helpers";
import { extractParamFromUrl } from "@/lib/api-req";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = extractParamFromUrl(req);

    if (!id) {
      return jsonResponse({ error: "User ID is required" }, 400);
    }

    const { data, error } = await supabase
      .from("answers")
      .select("question:question_id(*, user:user_id(*))")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return jsonResponse(data ?? []);
  } catch (error) {
    return handleError(error);
  }
}
