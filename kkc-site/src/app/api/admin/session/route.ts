import { NextResponse } from "next/server";
import { isAdminUser, getCurrentUser } from "@/lib/supabase-admin-auth";

export async function GET() {
  try {
    const isAdmin = await isAdminUser();
    const user = await getCurrentUser();
    
    return NextResponse.json({ 
      isAdmin,
      user: user ? {
        id: user.id,
        email: user.email
      } : null
    });
  } catch (error) {
    console.error("Admin session error:", error);
    return NextResponse.json({ isAdmin: false, user: null });
  }
}
