import {
  subscribeFavorites as subscribeFavoritesSupabase,
  addFavorite as addFavoriteSupabase,
  removeFavorite as removeFavoriteSupabase
} from "@/lib/supabase/favorites";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function listenFavorites(
  uid: string,
  onIds: (ids: Set<string>) => void
): (() => void) | null {
  if (isSupabaseConfigured()) {
    return subscribeFavoritesSupabase(uid, onIds);
  }
  return null;
}

export async function addFavorite(uid: string, productId: string) {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  await addFavoriteSupabase(uid, productId);
}

export async function removeFavorite(uid: string, productId: string) {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  await removeFavoriteSupabase(uid, productId);
}
