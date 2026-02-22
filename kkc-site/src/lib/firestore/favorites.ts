import { collection, deleteDoc, doc, onSnapshot, setDoc, type Unsubscribe } from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase/client";

export function listenFavorites(uid: string, onIds: (ids: Set<string>) => void) {
  const db = getFirebaseDb();
  if (!db) return null;

  const unsub: Unsubscribe = onSnapshot(collection(db, "users", uid, "favorites"), (snap) => {
    const next = new Set<string>();
    for (const d of snap.docs) next.add(d.id);
    onIds(next);
  });

  return unsub;
}

export async function addFavorite(uid: string, productId: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore not configured");
  await setDoc(doc(db, "users", uid, "favorites", productId), { productId, createdAt: Date.now() });
}

export async function removeFavorite(uid: string, productId: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "users", uid, "favorites", productId));
}

