"use client";

import { getSupabase } from "./client";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const sb = getSupabase();
  if (!sb) return fileToDataUrl(file);

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `products/${productId}/${Date.now()}.${ext}`;

  const { error } = await sb.storage.from("products").upload(path, file, {
    contentType: file.type,
    upsert: true
  });

  if (error) throw error;

  const {
    data: { publicUrl }
  } = sb.storage.from("products").getPublicUrl(path);
  return publicUrl;
}
