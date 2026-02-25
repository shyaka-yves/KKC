import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export async function POST() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
    }
    
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ ok: false, error: "Logout failed" }, { status: 500 });
  }
}
