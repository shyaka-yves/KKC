"use client";

import { useEffect, useMemo, useState } from "react";

import { listenVisibleProducts } from "@/lib/firestore/products";
import { SAMPLE_PRODUCTS } from "@/lib/products/sample";
import type { Product } from "@/lib/products/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [source, setSource] = useState<"sample" | "firestore">("sample");

  useEffect(() => {
    const unsub = listenVisibleProducts(
      (items) => {
        setProducts(items);
        setSource("firestore");
      },
      () => {
        setProducts(SAMPLE_PRODUCTS);
        setSource("sample");
      }
    );

    return () => unsub?.();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) set.add(p.category);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  return { products, categories, source };
}

