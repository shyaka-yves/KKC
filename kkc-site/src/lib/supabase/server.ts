import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

export function getSupabaseServer() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  
  if (!url || !key) {
    throw new Error("Supabase URL and Anon Key are required");
  }
  
  return createClient<Database>(url, key);
}

export function isSupabaseConfigured() {
  return !!(getSupabaseUrl() && getSupabaseAnonKey());
}
