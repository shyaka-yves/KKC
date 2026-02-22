"use client";

import { uploadProductImage as uploadSupabase } from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  if (isSupabaseConfigured()) {
    return uploadSupabase(file, productId);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
