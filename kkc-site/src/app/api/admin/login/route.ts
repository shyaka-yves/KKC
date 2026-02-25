import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || "").toString().trim();
    const password = (body.password || "").toString();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("roles")
      .select("role, admin")
      .eq("user_id", data.user.id)
      .single();

    const role = roleData as { role?: string; admin?: boolean } | null;
    if (!role?.admin && role?.role !== "admin") {
      await supabase.auth.signOut();
      return NextResponse.json({ ok: false, error: "Admin access required" }, { status: 403 });
    }

    return NextResponse.json({ ok: true, user: { id: data.user.id, email: data.user.email } });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
