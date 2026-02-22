import type { MetadataRoute } from "next";

import { locales } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kkc-quincaillerie.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/products", "/about", "/contact", "/admin"];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date()
      });
    }
  }

  return entries;
}

