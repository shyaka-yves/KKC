import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = getSupabaseServer();
    
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ ok: false, error: "Logout failed" }, { status: 500 });
  }
}
