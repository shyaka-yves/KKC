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

    console.log("=== LOGIN ATTEMPT ===");
    console.log("Email:", email);
    console.log("Supabase URL:", url);
    console.log("Supabase configured:", !!(url && key));
    
    const supabase = getSupabaseServer();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("AUTH ERROR:", error);
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }

    console.log("AUTH SUCCESS - User ID:", data.user.id);

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role, admin")
      .eq("user_id", data.user.id)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows

    console.log("ROLE QUERY RESULT:", { roleData, roleError, userId: data.user.id });

    if (roleError) {
      console.error("ROLE ERROR:", roleError);
      await supabase.auth.signOut();
      return NextResponse.json({ ok: false, error: "Admin access required" }, { status: 403 });
    }

    const role = roleData as { role?: string; admin?: boolean } | null;
    console.log("ROLE DATA:", role);
    
    if (!role?.admin && role?.role !== "admin") {
      console.log("ADMIN ACCESS DENIED - Role:", role, "User ID:", data.user.id);
      await supabase.auth.signOut();
      return NextResponse.json({ ok: false, error: "Admin access required" }, { status: 403 });
    }

    console.log("LOGIN SUCCESSFUL - Admin access granted");
    return NextResponse.json({ ok: true, user: { id: data.user.id, email: data.user.email } });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ 
      ok: false, 
      error: "Server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
