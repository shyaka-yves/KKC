import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kkc-admin-fallback";
  return secret;
}

export function createAdminSession() {
  const secret = getSecret();
  const payload = JSON.stringify({ admin: true, t: Date.now() });
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  const token = `${Buffer.from(payload).toString("base64url")}.${signature}`;
  return token;
}

export function verifyAdminSession(token: string): boolean {
  try {
    const [raw, sig] = token.split(".");
    if (!raw || !sig) return false;
    const payloadStr = Buffer.from(raw, "base64url").toString("utf8");
    const payload = JSON.parse(payloadStr);
    if (!payload.admin || typeof payload.t !== "number") return false;
    if (Date.now() - payload.t > MAX_AGE * 1000) return false;
    const secret = getSecret();
    const expected = createHmac("sha256", secret).update(payloadStr).digest("base64url");
    return timingSafeEqual(Buffer.from(sig, "base64url"), Buffer.from(expected, "base64url"));
  } catch {
    return false;
  }
}

export async function setAdminCookie() {
  const token = createAdminSession();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/"
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminSession(token);
}
