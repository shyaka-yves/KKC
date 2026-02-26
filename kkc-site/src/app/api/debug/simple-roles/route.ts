import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    // Get all roles (this should work with RLS policies)
    const { data: allRoles, error: allRolesError } = await supabase
      .from("roles")
      .select("*");

    return NextResponse.json({
      roles: allRoles || [],
      error: allRolesError?.message
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, role, admin } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Insert or update role with proper typing
    const { data, error } = await supabase
      .from("roles")
      .upsert({
        user_id: userId,
        role: role || 'admin',
        admin: admin !== false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, role: data });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
