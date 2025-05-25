import { badRequest, handleError, jsonResponse } from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const { wallet } = await Promise.resolve(params);

    if (!wallet) {
      return badRequest("User ID is required");
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
