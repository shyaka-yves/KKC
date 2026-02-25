import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    
    // Get all roles for debugging
    const { data: allRoles, error: allRolesError } = await supabase
      .from("roles")
      .select("*");
    
    // Get all users for debugging
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    return NextResponse.json({
      roles: allRoles || [],
      rolesError: allRolesError?.message,
      users: users?.users.map(u => ({ id: u.id, email: u.email })) || [],
      usersError: usersError?.message
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
