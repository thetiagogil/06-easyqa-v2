import { handleError, jsonResponse } from "@/lib/api-helpers";
import { extractParamsFromUrl } from "@/lib/api-req";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { auth: wallet } = extractParamsFromUrl(req, ["auth"]);

    if (!wallet) {
      return jsonResponse({ error: "Wallet address is required" }, 400);
    }

    const { data: getUser, error: getError } = await supabase
      .from("users")
      .select()
      .eq("wallet", wallet)
      .maybeSingle();

    if (getError) throw getError;

    if (getUser) {
      return jsonResponse(getUser);
    }

    const { data: createUser, error: createError } = await supabase
      .from("users")
      .insert([{ wallet }])
      .select()
      .maybeSingle();

    if (createError) throw createError;

    return jsonResponse(createUser);
  } catch (error) {
    return handleError(error);
  }
}
