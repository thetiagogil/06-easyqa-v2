import { badRequest, handleError, jsonResponse } from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: targetId } = await Promise.resolve(params);

    if (!targetId) {
      return badRequest("Target ID is required");
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
