import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, name } = await req.json();

    if (!userId || !name) {
      return NextResponse.json({ error: "Missing userId or name." }, { status: 400 });
    }

    const { error } = await supabase.from("users").update({ name }).eq("id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Name updated successfully." });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
