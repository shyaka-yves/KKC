import {
  subscribeCategories as subscribeCategoriesSupabase,
  upsertCategory as upsertCategorySupabase,
  deleteCategory as deleteCategorySupabase,
  type Category
} from "@/lib/supabase/categories";
import {
  subscribeCategories as subscribeCategoriesLocal,
  upsertCategoryLocal,
  deleteCategoryLocal
} from "@/lib/local-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export type { Category };

export function listenCategories(onData: (cats: Category[]) => void): (() => void) | null {
  if (isSupabaseConfigured()) {
    return subscribeCategoriesSupabase(onData);
  }
  return subscribeCategoriesLocal((raw) => {
    onData((raw as Category[]).map((c) => ({ ...c, id: String(c.id ?? "") })));
  });
}

export async function upsertCategory(cat: Omit<Category, "id"> & { id?: string }): Promise<string> {
  if (isSupabaseConfigured()) {
    return upsertCategorySupabase(cat);
  }
  return upsertCategoryLocal(cat as Record<string, unknown> & { id?: string });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  if (isSupabaseConfigured()) {
    await deleteCategorySupabase(categoryId);
    return;
  }
  deleteCategoryLocal(categoryId);
}
