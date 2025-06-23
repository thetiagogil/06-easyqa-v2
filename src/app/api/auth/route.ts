import { ENV_VARS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest, NextResponse } from "next/server";

const privy = new PrivyClient(ENV_VARS.PRIVY_APP_ID!, ENV_VARS.PRIVY_APP_SECRET!);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

  const claims = await privy.verifyAuthToken(token);
  const { userId: userPrivyId } = claims;

  // 1 - Check if user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("privy_id", userPrivyId)
    .maybeSingle();

  if (fetchError) {
    console.error(fetchError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (existingUser) {
    return NextResponse.json(existingUser);
  }

  // 2 - Create user if not exists
  const { data: newUser, error: createError } = await supabase
    .from("users")
    .insert({ privy_id: userPrivyId })
    .select()
    .single();

  if (createError) {
    console.error("Create Error", createError.message, createError.details, createError.hint);
    return NextResponse.json({ error: "Could not create user" }, { status: 500 });
  }

  return NextResponse.json(newUser);
}
