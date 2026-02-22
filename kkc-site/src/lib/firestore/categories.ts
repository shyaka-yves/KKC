import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Unsubscribe
} from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase/client";
import {
  subscribeCategories,
  upsertCategoryLocal,
  deleteCategoryLocal
} from "@/lib/local-store";

export type Category = {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
  order: number;
  createdAt?: number;
  updatedAt?: number;
};

export function listenCategories(onData: (cats: Category[]) => void): (() => void) | null {
  const db = getFirebaseDb();
  if (db) {
    const q = query(collection(db, "categories"), orderBy("order", "asc"));
    const unsub: Unsubscribe = onSnapshot(q, (snap) => {
      onData(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) }))
      );
    });
    return unsub;
  }
  return subscribeCategories((raw) => {
    onData((raw as Category[]).map((c) => ({ ...c, id: String(c.id ?? "") })));
  });
}

export async function upsertCategory(cat: Omit<Category, "id"> & { id?: string }): Promise<string> {
  const db = getFirebaseDb();
  if (db) {
    const now = Date.now();
    const payload = { ...cat, updatedAt: now, createdAt: cat.createdAt ?? now };
    if (cat.id) {
      await setDoc(doc(db, "categories", cat.id), payload, { merge: true });
      return cat.id;
    }
    const created = await addDoc(collection(db, "categories"), payload);
    return created.id;
  }
  return upsertCategoryLocal(cat as Record<string, unknown> & { id?: string });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const db = getFirebaseDb();
  if (db) {
    await deleteDoc(doc(db, "categories", categoryId));
    return;
  }
  deleteCategoryLocal(categoryId);
}

