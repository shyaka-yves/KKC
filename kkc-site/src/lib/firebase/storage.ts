"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { getFirebaseStorage } from "./client";

/** Convert file to data URL when Storage is not configured (localStorage fallback). */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function uploadProductImage(file: File, _productId: string): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) {
    return fileToDataUrl(file);
  }
  const key = `products/${_productId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, key);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return await getDownloadURL(storageRef);
}

