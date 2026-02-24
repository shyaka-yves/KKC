import {
  subscribeVisibleProducts as listenVisibleSupabase,
  subscribeAllProducts as listenAllSupabase,
  subscribeFeaturedProducts as listenFeaturedSupabase,
  upsertProduct as upsertProductSupabase,
  deleteProduct as deleteProductSupabase
} from "@/lib/supabase/products";
import {
  subscribeProducts,
  upsertProductLocal,
  deleteProductLocal
} from "@/lib/local-store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Product } from "@/lib/products/types";

export function listenVisibleProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
): (() => void) | null {
  if (isSupabaseConfigured()) {
    return listenVisibleSupabase(onData, onError);
  }
  return subscribeProducts((raw) => {
    const products = (raw as Product[])
      .filter((p) => p.visible !== false)
      .map((p) => ({ ...p, id: String(p.id ?? "") }))
      .sort((a, b) => ((b.updatedAt ?? 0) - (a.updatedAt ?? 0)))
      .slice(0, 200);
    onData(products);
  });
}

export function listenAllProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
): (() => void) | null {
  if (isSupabaseConfigured()) {
    return listenAllSupabase(onData, onError);
  }
  return subscribeProducts((raw) => {
    const products = (raw as Product[]).map((p) => ({ ...p, id: String(p.id ?? "") }));
    onData(products);
  });
}

export async function listAllProducts(): Promise<Product[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    description: String(row.description ?? ""),
    category: String(row.category ?? ""),
    imageUrl: String(row.image_url ?? ""),
    price: (row.price as number | null) ?? null,
    currency: (row.currency as "RWF" | "USD" | null) ?? null,
    showPrice: Boolean(row.show_price),
    visible: row.visible !== false,
    featured: row.featured === true,
    createdAt: row.created_at ? new Date(row.created_at as string).getTime() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at as string).getTime() : undefined
  })) as Product[];
}

export async function upsertProduct(
  product: Omit<Product, "id"> & { id?: string }
): Promise<string> {
  if (isSupabaseConfigured()) {
    return upsertProductSupabase(product);
  }
  return upsertProductLocal(product as Record<string, unknown> & { id?: string });
}

export async function deleteProduct(productId: string): Promise<void> {
  if (isSupabaseConfigured()) {
    await deleteProductSupabase(productId);
    return;
  }
  deleteProductLocal(productId);
}

export function listenFeaturedProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
): (() => void) | null {
  if (isSupabaseConfigured()) {
    return listenFeaturedSupabase(onData, onError);
  }
  return subscribeProducts((raw) => {
    const products = (raw as Product[])
      .filter((p) => p.visible !== false && p.featured === true)
      .map((p) => ({ ...p, id: String(p.id ?? "") }))
      .sort((a, b) => ((b.updatedAt ?? 0) - (a.updatedAt ?? 0)))
      .slice(0, 10);
    onData(products);
  });
}

// NOTE: This file provides a compatibility layer between the legacy
// "firestore" API and the current Supabase implementation. It is safe
// to modify comments here without changing runtime behaviour.
