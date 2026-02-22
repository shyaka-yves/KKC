"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  if (!client) {
    client = createClient<Database>(url, key);
  }
  return client;
}

export function isSupabaseConfigured() {
  return !!(getSupabaseUrl() && getSupabaseAnonKey());
}
