"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/products/ProductCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

export function ProductsPageClient() {
  const t = useTranslations();
  const { products, categories } = useProducts();
  const { favoriteIds } = useFavorites();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("__all__");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "__all__" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, query, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-brand-blue-700 uppercase">
            {t("nav.products")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {t("products.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            {t("products.subtitle")}
          </p>
        </div>

        <div className="flex w-full items-center gap-2 rounded-2xl border-2 border-brand-blue-200 bg-brand-blue-50/80 px-4 py-3 shadow-sm md:max-w-md focus-within:border-brand-blue-400 focus-within:ring-2 focus-within:ring-brand-blue-200">
          <Search className="h-4 w-4 text-brand-blue-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("products.searchPlaceholder")}
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-12">
        <aside className="md:col-span-3">
          <div className="rounded-2xl border-2 border-brand-blue-200 bg-brand-blue-50/60 p-4 shadow-sm">
            <div className="text-sm font-semibold text-brand-blue-800">
              {t("products.categories")}
            </div>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={() => setCategory("__all__")}
                className={cn(
                  "rounded-xl px-3 py-2 text-left text-sm font-medium transition",
                  category === "__all__"
                    ? "bg-brand-blue-600 text-white shadow-md shadow-brand-blue-600/25"
                    : "text-slate-700 hover:bg-brand-blue-50 hover:text-brand-blue-700"
                )}
              >
                {t("products.all")}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-left text-sm font-medium transition",
                    category === c
                      ? "bg-brand-blue-600 text-white shadow-md shadow-brand-blue-600/25"
                      : "text-slate-700 hover:bg-brand-blue-50 hover:text-brand-blue-700"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="md:col-span-9">
          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-sm text-slate-700">
              {t("products.noResults")}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} isFavorite={favoriteIds.has(p.id)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

