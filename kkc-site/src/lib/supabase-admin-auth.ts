import { getSupabase } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";

export async function getCurrentUser() {
  const supabase = getSupabase();
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAdminUser(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = getSupabase();
  if (!supabase) return false;

  const { data } = await supabase
    .from("roles")
    .select("role, admin")
    .eq("user_id", user.id)
    .single();

  const roleData = data as Database['public']['Tables']['roles']['Row'] | null;
  return roleData?.admin === true || roleData?.role === "admin";
}

export async function requireAdmin() {
  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    throw new Error("Admin access required");
  }
}
