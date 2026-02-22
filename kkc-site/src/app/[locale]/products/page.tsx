import { setRequestLocale } from "next-intl/server";

import { ProductsPageClient } from "@/components/products/ProductsPageClient";

export default async function ProductsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProductsPageClient />;
}

