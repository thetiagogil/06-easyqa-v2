import { badRequest, handleError, jsonResponse } from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return badRequest("User ID is required");
    }

    const { data, error } = await supabase
      .from("answers")
      .select("question:question_id(*, user:user_id(*))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return jsonResponse(data ?? []);
  } catch (error) {
    return handleError(error);
  }
}
