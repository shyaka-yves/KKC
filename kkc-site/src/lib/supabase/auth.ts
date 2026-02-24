"use client";

import { getSupabase } from "./client";

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data } = await sb.from("roles").select("role, admin").eq("user_id", userId).single();
  const row = data as { role?: string | null; admin?: boolean | null } | null;
  return row?.admin === true || row?.role === "admin";
}
