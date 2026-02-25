import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ isAdmin: false, user: null });
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("roles")
      .select("role, admin")
      .eq("user_id", user.id)
      .single();

    const role = roleData as { role?: string; admin?: boolean } | null;
    const isAdmin = role?.admin === true || role?.role === "admin";
    
    return NextResponse.json({ 
      isAdmin,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Admin session error:", error);
    return NextResponse.json({ isAdmin: false, user: null });
  }
}
