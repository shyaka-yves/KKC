"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/products/ProductCard";
import { useFavorites } from "@/hooks/useFavorites";
import { listenFeaturedProducts } from "@/lib/firestore/products";
import type { Product } from "@/lib/products/types";

export function FeaturedProducts() {
  const t = useTranslations();
  const { favoriteIds } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsub = listenFeaturedProducts(
      (items) => setProducts(items),
      () => setProducts([])
    );
    return () => unsub?.();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-brand-blue-700 uppercase">
              {t("home.featuredProducts")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {t("home.featuredProducts")}
            </h2>
          </div>
          <div className="hidden h-px flex-1 bg-gradient-to-r from-slate-200/0 via-slate-200/80 to-slate-200/0 md:block" />
        </div>
      </Reveal>

      <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, idx) => (
          <Reveal key={product.id} delay={idx * 0.06}>
            <ProductCard product={product} isFavorite={favoriteIds.has(product.id)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
