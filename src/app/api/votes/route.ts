import { badRequest, handleError, jsonResponse } from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const {
      user_id: userId,
      target_id: targetId,
      target_type: targetType,
      type: voteType,
    } = requestBody;

    if (!userId || !targetId || !targetType || !voteType) {
      return badRequest(
        "Missing required fields: user_id, target_id, target_type, or type."
      );
    }

    if (!["question", "answer"].includes(targetType)) {
      return badRequest("target_type must be 'question' or 'answer'.");
    }

    const { data: existingVote, error: findError } = await supabase
      .from("votes")
      .select("id, type")
      .eq("user_id", userId)
      .eq("target_id", targetId)
      .eq("target_type", targetType)
      .maybeSingle();
    if (findError) throw findError;

    if (existingVote) {
      if (existingVote.type === voteType) {
        // Delete
        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("id", existingVote.id);
        if (deleteError) throw deleteError;
      } else {
        // Update
        const { error: updateError } = await supabase
          .from("votes")
          .update({ type: voteType })
          .eq("id", existingVote.id);
        if (updateError) throw updateError;
      }
    } else {
      // Create
      const { error: insertError } = await supabase.from("votes").insert({
        user_id: userId,
        target_id: targetId,
        target_type: targetType,
        type: voteType,
      });
      if (insertError) throw insertError;
    }

    return jsonResponse({ success: true });
  } catch (caughtError) {
    return handleError(caughtError);
  }
}
