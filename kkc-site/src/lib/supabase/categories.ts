"use client";

import { getSupabase } from "./client";

export type Category = {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
  order: number;
  createdAt?: number;
  updatedAt?: number;
};

type CategoryRow = {
  id?: string;
  name: string;
  slug: string;
  visible: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

function rowToCategory(row: CategoryRow & { id: string }): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    visible: row.visible,
    order: row.order,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime()
  };
}

export function subscribeCategories(onData: (cats: Category[]) => void): (() => void) | null {
  const sb = getSupabase();
  if (!sb) return null;

  const channel = sb
    .channel("categories")
    .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () =>
      fetchCategories(onData)
    )
    .subscribe();

  fetchCategories(onData);

  return () => {
    sb.removeChannel(channel);
  };
}

async function fetchCategories(onData: (cats: Category[]) => void) {
  const sb = getSupabase();
  if (!sb) return;
  const { data } = await sb.from("categories").select("*").order("order", { ascending: true });
  onData(((data ?? []) as CategoryRow[]).map((row) => rowToCategory(row as CategoryRow & { id: string })));
}

export async function upsertCategory(cat: Omit<Category, "id"> & { id?: string }): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");

  const now = new Date().toISOString();
  const row: CategoryRow = {
    name: cat.name,
    slug: cat.slug,
    visible: cat.visible,
    order: cat.order,
    updated_at: now,
    created_at: cat.createdAt ? new Date(cat.createdAt).toISOString() : now
  };

  if (cat.id) {
    await (sb.from("categories") as any).upsert(
      { id: cat.id, ...row },
      { onConflict: "id" }
    );
    return cat.id;
  }
  const { data, error } = await (sb.from("categories") as any)
    .insert(row)
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  await sb.from("categories").delete().eq("id", categoryId);
}
