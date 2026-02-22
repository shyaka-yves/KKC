import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  type Unsubscribe
} from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase/client";
import {
  subscribeProducts,
  upsertProductLocal,
  deleteProductLocal
} from "@/lib/local-store";
import type { Product } from "@/lib/products/types";

export function listenVisibleProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
): (() => void) | null {
  const db = getFirebaseDb();
  if (db) {
    const q = query(
      collection(db, "products"),
      where("visible", "==", true),
      orderBy("updatedAt", "desc"),
      limit(200)
    );
    const unsub: Unsubscribe = onSnapshot(
      q,
      (snap) => {
        const products: Product[] = snap.docs.map((d) => {
          const data = d.data() as Omit<Product, "id">;
          return { id: d.id, ...data };
        });
        onData(products);
      },
      () => onError?.()
    );
    return unsub;
  }
  // localStorage fallback: show admin-entered products
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
  const db = getFirebaseDb();
  if (db) {
    const q = query(
      collection(db, "products"),
      orderBy("updatedAt", "desc"),
      limit(500)
    );
    const unsub: Unsubscribe = onSnapshot(
      q,
      (snap) => {
        const products: Product[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Product, "id">)
        }));
        onData(products);
      },
      () => onError?.()
    );
    return unsub;
  }
  return subscribeProducts((raw) => {
    const products = (raw as Product[]).map((p) => ({ ...p, id: String(p.id ?? "") }));
    onData(products);
  });
}

export async function listAllProducts() {
  const db = getFirebaseDb();
  if (!db) return [] as Product[];
  const snap = await getDocs(query(collection(db, "products"), orderBy("updatedAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }));
}

export async function upsertProduct(
  product: Omit<Product, "id"> & { id?: string }
): Promise<string> {
  const db = getFirebaseDb();
  if (db) {
    const now = Date.now();
    const payload = {
      ...product,
      updatedAt: now,
      createdAt: product.createdAt ?? now
    };
    if (product.id) {
      await setDoc(doc(db, "products", product.id), payload, { merge: true });
      return product.id;
    }
    const created = await addDoc(collection(db, "products"), payload);
    return created.id;
  }
  return upsertProductLocal(product as Record<string, unknown> & { id?: string });
}

export async function deleteProduct(productId: string): Promise<void> {
  const db = getFirebaseDb();
  if (db) {
    await deleteDoc(doc(db, "products", productId));
    return;
  }
  deleteProductLocal(productId);
}

export function listenFeaturedProducts(
  onData: (products: Product[]) => void,
  onError?: () => void
): (() => void) | null {
  const db = getFirebaseDb();
  if (db) {
    const q = query(
      collection(db, "products"),
      where("visible", "==", true),
      where("featured", "==", true),
      orderBy("updatedAt", "desc"),
      limit(10)
    );
    const unsub: Unsubscribe = onSnapshot(
      q,
      (snap) => {
        const products: Product[] = snap.docs.map((d) => {
          const data = d.data() as Omit<Product, "id">;
          return { id: d.id, ...data };
        });
        onData(products);
      },
      () => onError?.()
    );
    return unsub;
  }
  // localStorage fallback: show admin-entered featured products
  return subscribeProducts((raw) => {
    const products = (raw as Product[])
      .filter((p) => p.visible !== false && p.featured === true)
      .map((p) => ({ ...p, id: String(p.id ?? "") }))
      .sort((a, b) => ((b.updatedAt ?? 0) - (a.updatedAt ?? 0)))
      .slice(0, 10);
    onData(products);
  });
}

