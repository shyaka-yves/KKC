import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // Debug environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.error("Missing Supabase environment variables:", { 
        url: !!url, 
        key: !!key 
      });
      return NextResponse.json({ 
        ok: false, 
        error: "Supabase not configured properly" 
      }, { status: 500 });
    }

    const body = await request.json();
    const email = (body.email || "").toString().trim();
    const password = (body.password || "").toString();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
    }

    console.log("Attempting login for email:", email);
    
    const supabase = getSupabaseServer();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase auth error:", error);
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }

    console.log("Auth successful for user:", data.user.id);

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role, admin")
      .eq("user_id", data.user.id)
      .single();

    if (roleError) {
      console.error("Role check error:", roleError);
      await supabase.auth.signOut();
      return NextResponse.json({ ok: false, error: "Admin access required" }, { status: 403 });
    }

    const role = roleData as { role?: string; admin?: boolean } | null;
    console.log("User role:", role);
    
    if (!role?.admin && role?.role !== "admin") {
      await supabase.auth.signOut();
      return NextResponse.json({ ok: false, error: "Admin access required" }, { status: 403 });
    }

    console.log("Login successful for admin:", data.user.email);
    return NextResponse.json({ ok: true, user: { id: data.user.id, email: data.user.email } });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: "Server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
