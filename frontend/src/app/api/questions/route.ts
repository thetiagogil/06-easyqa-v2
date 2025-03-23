import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  const { data, error } = await supabase.from("questions").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
