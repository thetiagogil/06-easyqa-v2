import { handleError, jsonResponse, notFound } from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw error;
    if (!data || data.length === 0) return notFound("No users found");

    return jsonResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
