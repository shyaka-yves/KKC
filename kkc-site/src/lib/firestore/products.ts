import {
  listenVisibleProducts as listenVisibleSupabase,
  listenAllProducts as listenAllSupabase,
  listenFeaturedProducts as listenFeaturedSupabase,
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
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    imageUrl: row.image_url,
    price: row.price,
    currency: row.currency,
    showPrice: row.show_price,
    visible: row.visible,
    featured: row.featured,
    createdAt: row.created_at ? new Date(row.created_at as string).getTime() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at as string).getTime() : undefined
  }));
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
