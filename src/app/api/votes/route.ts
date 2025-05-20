import { handleError, jsonResponse } from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, target_id, target_type, type } = body;

    if (!user_id || !target_id || !target_type || !type) {
      return jsonResponse({ error: "Missing fields" }, 400);
    }

    const { data: existingVote, error: fetchError } = await supabase
      .from("votes")
      .select("*")
      .eq("user_id", user_id)
      .eq("target_id", target_id)
      .eq("target_type", target_type)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingVote) {
      if (existingVote.type === type) {
        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("id", existingVote.id);
        if (deleteError) throw deleteError;
      } else {
        const { error: updateError } = await supabase
          .from("votes")
          .update({ type })
          .eq("id", existingVote.id);
        if (updateError) throw updateError;
      }
    } else {
      const { error: insertError } = await supabase.from("votes").insert({
        user_id,
        target_id,
        target_type,
        type,
      });
      if (insertError) throw insertError;
    }

    return jsonResponse({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
