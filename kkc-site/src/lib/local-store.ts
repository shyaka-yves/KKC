/**
 * LocalStorage fallback when Firestore is not configured.
 * Used by admin dashboard for products and categories.
 */

const CATEGORIES_KEY = "kkc_categories";
const PRODUCTS_KEY = "kkc_products";

type Listener = () => void;
const categoryListeners = new Set<Listener>();
const productListeners = new Set<Listener>();

function notifyCategoryListeners() {
  categoryListeners.forEach((cb) => cb());
}

function notifyProductListeners() {
  productListeners.forEach((cb) => cb());
}

function getCategories(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCategories(data: Record<string, unknown>[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data));
  notifyCategoryListeners();
}

function getProducts(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setProducts(data: Record<string, unknown>[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
  notifyProductListeners();
}

export function subscribeCategories(onData: (data: Record<string, unknown>[]) => void) {
  const wrapped = () => onData(getCategories());
  categoryListeners.add(wrapped);
  wrapped();
  return () => categoryListeners.delete(wrapped);
}

export function subscribeProducts(onData: (data: Record<string, unknown>[]) => void) {
  const wrapped = () => onData(getProducts());
  productListeners.add(wrapped);
  wrapped();
  return () => productListeners.delete(wrapped);
}

export function upsertCategoryLocal(cat: Record<string, unknown> & { id?: string }) {
  const now = Date.now();
  const payload = { ...cat, updatedAt: now, createdAt: cat.createdAt ?? now };
  const data = getCategories();
  const id = (payload.id as string) || `cat_${Date.now()}`;
  const idx = data.findIndex((c) => (c.id as string) === id);
  const item = { ...payload, id };
  if (idx >= 0) data[idx] = item;
  else data.push(item);
  data.sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0));
  setCategories(data);
  return id;
}

export function deleteCategoryLocal(id: string) {
  setCategories(getCategories().filter((c) => (c.id as string) !== id));
}

export function upsertProductLocal(prod: Record<string, unknown> & { id?: string }) {
  const now = Date.now();
  const payload = { ...prod, updatedAt: now, createdAt: prod.createdAt ?? now };
  const data = getProducts();
  const id = (payload.id as string) || `prod_${Date.now()}`;
  const idx = data.findIndex((p) => (p.id as string) === id);
  const item = { ...payload, id };
  if (idx >= 0) data[idx] = item;
  else data.push(item);
  data.sort((a, b) => ((b.updatedAt as number) ?? 0) - ((a.updatedAt as number) ?? 0));
  setProducts(data);
  return id;
}

export function deleteProductLocal(id: string) {
  setProducts(getProducts().filter((p) => (p.id as string) !== id));
}
