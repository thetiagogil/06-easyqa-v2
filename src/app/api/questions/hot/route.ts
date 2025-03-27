import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  const { data, error } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
