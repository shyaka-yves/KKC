"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { addFavorite, removeFavorite } from "@/lib/firestore/favorites";
import type { Product } from "@/lib/products/types";
import { whatsappProductUrl } from "@/lib/shop/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

export function ProductCard({
  product,
  isFavorite
}: {
  product: Product;
  isFavorite: boolean;
}) {
  const t = useTranslations();
  const { user, isEnabled } = useAuth();
  const waUrl = useMemo(() => whatsappProductUrl(product.name), [product.name]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group glass overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.06]"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-70" />
        <div className="absolute left-4 top-4 rounded-full bg-brand-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md">
          {product.category}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold tracking-tight text-slate-950">
              {product.name}
            </div>
            <div className="mt-1 text-sm leading-6 text-slate-600 line-clamp-2">
              {product.description}
            </div>
          </div>

          <button
            type="button"
            disabled={!user || !isEnabled}
            onClick={async () => {
              if (!user) return;
              if (isFavorite) await removeFavorite(user.uid, product.id);
              else await addFavorite(user.uid, product.id);
            }}
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
              isFavorite
                ? "border-brand-orange-400 bg-brand-orange-100 text-brand-orange-600"
                : "border-brand-orange-200 bg-brand-orange-50 text-brand-orange-600 hover:bg-brand-orange-100 hover:border-brand-orange-300"
            )}
            aria-label={isFavorite ? t("products.unfavorite") : t("products.favorite")}
            title={user ? (isFavorite ? t("products.unfavorite") : t("products.favorite")) : t("nav.login")}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </button>
        </div>

        {product.showPrice && product.price ? (
          <div className="mt-3 text-sm font-semibold text-slate-900">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: product.currency ?? "RWF",
              maximumFractionDigits: 0
            }).format(product.price)}
          </div>
        ) : null}

        <div className="mt-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-brand-orange-500 to-brand-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-orange-500/25 transition hover:from-brand-orange-400 hover:to-brand-orange-600"
          >
            <MessageCircle className="h-4 w-4" />
            {t("products.chat")}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

