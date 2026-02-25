import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    return NextResponse.json({
      url: url ? "configured" : "missing",
      key: key ? "configured" : "missing",
      urlLength: url?.length || 0,
      keyLength: key?.length || 0
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
