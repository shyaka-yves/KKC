import { NextResponse } from "next/server";

import { setAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || "").toString().trim();
    const password = (body.password || "").toString();

    const adminEmail = process.env.ADMIN_EMAIL || "shyakayvany@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "shyaka1234";

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }

    await setAdminCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
