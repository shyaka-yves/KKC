"use client";

import type { Product } from "@/lib/products/types";
import { getSupabase } from "./client";

function rowToProduct(row: {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  price: number | null;
  currency: string | null;
  show_price: boolean;
  visible: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    imageUrl: row.image_url,
    price: row.price,
    currency: row.currency as "RWF" | "USD" | null,
    showPrice: row.show_price,
    visible: row.visible,
    featured: row.featured,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime()
  };
}

export function subscribeVisibleProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
): (() => void) | null {
  const sb = getSupabase();
  if (!sb) return null;

  const channel = sb
    .channel("visible-products")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "products",
        filter: "visible=eq.true"
      },
      () => fetchVisibleProducts(onData, onError)
    )
    .subscribe();

  fetchVisibleProducts(onData, onError);

  return () => {
    sb.removeChannel(channel);
  };
}

async function fetchVisibleProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
) {
  const sb = getSupabase();
  if (!sb) {
    onError?.();
    return;
  }
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("visible", true)
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error) {
    onError?.();
    return;
  }
  onData((data ?? []).map(rowToProduct));
}

export function subscribeAllProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
): (() => void) | null {
  const sb = getSupabase();
  if (!sb) return null;

  const channel = sb
    .channel("all-products")
    .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () =>
      fetchAllProducts(onData, onError)
    )
    .subscribe();

  fetchAllProducts(onData, onError);

  return () => {
    sb.removeChannel(channel);
  };
}

async function fetchAllProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
) {
  const sb = getSupabase();
  if (!sb) {
    onError?.();
    return;
  }
  const { data, error } = await sb
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(500);
  if (error) {
    onError?.();
    return;
  }
  onData((data ?? []).map(rowToProduct));
}

export function subscribeFeaturedProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
): (() => void) | null {
  const sb = getSupabase();
  if (!sb) return null;

  const channel = sb
    .channel("featured-products")
    .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () =>
      fetchFeaturedProducts(onData, onError)
    )
    .subscribe();

  fetchFeaturedProducts(onData, onError);

  return () => {
    sb.removeChannel(channel);
  };
}

async function fetchFeaturedProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
) {
  const sb = getSupabase();
  if (!sb) {
    onError?.();
    return;
  }
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("visible", true)
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(10);
  if (error) {
    onError?.();
    return;
  }
  onData((data ?? []).map(rowToProduct));
}

export async function upsertProduct(
  product: Omit<Product, "id"> & { id?: string }
): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");

  const now = new Date().toISOString();
  const row = {
    name: product.name,
    description: product.description,
    category: product.category,
    image_url: product.imageUrl,
    price: product.price ?? null,
    currency: product.currency ?? "RWF",
    show_price: product.showPrice,
    visible: product.visible,
    featured: product.featured ?? false,
    updated_at: now,
    created_at: product.createdAt ? new Date(product.createdAt).toISOString() : now
  };

  if (product.id) {
    await sb.from("products").upsert(
      { id: product.id, ...row },
      { onConflict: "id" }
    );
    return product.id;
  }
  const { data, error } = await sb.from("products")
    .insert(row)
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function deleteProduct(productId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  await sb.from("products").delete().eq("id", productId);
}
