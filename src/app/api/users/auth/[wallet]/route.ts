import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: { wallet: string } }
) {
  const { wallet } = await params;
  const { data: getUser, error: getError } = await supabase
    .from("users")
    .select()
    .eq("wallet", wallet)
    .maybeSingle();

  if (getError) {
    return NextResponse.json({ error: getError.message }, { status: 500 });
  }
  if (getUser) {
    return NextResponse.json(getUser);
  }

  const { data: createUser, error: createError } = await supabase
    .from("users")
    .insert([{ wallet }])
    .select()
    .maybeSingle();

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  return NextResponse.json(createUser);
}
