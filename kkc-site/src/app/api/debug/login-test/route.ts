import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log("Login test attempt for:", email);
    
    const supabase = getSupabaseServer();
    
    // Test 1: Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      return NextResponse.json({ 
        error: "Missing environment variables",
        url: !!url,
        key: !!key
      }, { status: 500 });
    }
    
    // Test 2: Try authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return NextResponse.json({ 
        error: "Authentication failed",
        details: error.message,
        code: error.name
      }, { status: 401 });
    }
    
    // Test 3: Check admin role
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role, admin")
      .eq("user_id", data.user.id)
      .single();
    
    if (roleError) {
      return NextResponse.json({ 
        error: "Role check failed",
        details: roleError.message,
        userId: data.user.id
      }, { status: 403 });
    }
    
    return NextResponse.json({ 
      success: true,
      user: { id: data.user.id, email: data.user.email },
      role: roleData
    });
    
  } catch (error) {
    console.error("Login test error:", error);
    return NextResponse.json({ 
      error: "Server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
