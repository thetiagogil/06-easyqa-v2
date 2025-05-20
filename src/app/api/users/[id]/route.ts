import { handleError, jsonResponse, notFound } from "@/lib/api-helpers";
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
      .from("users")
      .select()
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return notFound("User not found");

    return jsonResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
