"use client";

import { getSupabase } from "./client";

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data } = await sb.from("roles").select("role, admin").eq("user_id", userId).single();
  return data?.admin === true || data?.role === "admin";
}
