import {
  badRequest,
  handleError,
  jsonResponse,
  notFound,
} from "@/lib/api-helpers";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = await Promise.resolve(params);

    if (!userId) {
      return badRequest("User ID is required");
    }

    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) throw error;
    if (!data) return notFound("User not found");

    return jsonResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
