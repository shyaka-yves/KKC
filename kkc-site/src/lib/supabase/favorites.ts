"use client";

import { getSupabase } from "./client";

export function subscribeFavorites(
  userId: string,
  onIds: (ids: Set<string>) => void
): (() => void) | null {
  const sb = getSupabase();
  if (!sb) return null;

  const channel = sb
    .channel(`favorites-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "favorites",
        filter: `user_id=eq.${userId}`
      },
      () => fetchFavorites(userId, onIds)
    )
    .subscribe();

  fetchFavorites(userId, onIds);

  return () => {
    sb.removeChannel(channel);
  };
}

async function fetchFavorites(
  userId: string,
  onIds: (ids: Set<string>) => void
) {
  const sb = getSupabase();
  if (!sb) return;
  const { data } = await sb
    .from("favorites")
    .select("product_id")
    .eq("user_id", userId);
  const set = new Set<string>();
  for (const row of (data ?? []) as { product_id: string }[]) set.add(row.product_id);
  onIds(set);
}

export async function addFavorite(userId: string, productId: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  await sb.from("favorites").upsert(
    { user_id: userId, product_id: productId, created_at: new Date().toISOString() },
    { onConflict: "user_id,product_id" }
  );
}

export async function removeFavorite(userId: string, productId: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  await sb.from("favorites").delete().eq("user_id", userId).eq("product_id", productId);
}
