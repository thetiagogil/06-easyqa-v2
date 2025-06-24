import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Missing name." }, { status: 400 });
  }

  const { error } = await supabase.from("users").update({ name }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Name updated successfully." });
}
