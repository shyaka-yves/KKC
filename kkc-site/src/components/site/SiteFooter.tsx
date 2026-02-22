"use client";

import { Facebook, Instagram, Linkedin, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const WHATSAPP_URL = "https://wa.me/250788318876";

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale();
  const base = `/${locale}`;

  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-white/55 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-lg font-semibold tracking-tight text-slate-950">
            {t("brand.name")}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>{t("brand.location")}</span>
          </div>
            <a
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-orange-600 hover:text-brand-orange-700"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
            >
              <Phone className="h-4 w-4" />
            <span>
              {t("brand.phoneLabel")}: +250 788 318 876
            </span>
          </a>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold tracking-tight text-slate-950">
            Navigation
          </div>
          <div className="grid gap-2 text-sm">
            <Link className="text-brand-blue-700 hover:text-brand-blue-600 font-medium" href={`${base}`}>
              {t("nav.home")}
            </Link>
            <Link
              className="text-brand-blue-700 hover:text-brand-blue-600 font-medium"
              href={`${base}/products`}
            >
              {t("nav.products")}
            </Link>
            <Link
              className="text-brand-blue-700 hover:text-brand-blue-600 font-medium"
              href={`${base}/about`}
            >
              {t("nav.about")}
            </Link>
            <Link
              className="text-brand-blue-700 hover:text-brand-blue-600 font-medium"
              href={`${base}/contact`}
            >
              {t("nav.contact")}
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold tracking-tight text-slate-950">
            Social
          </div>
          <div className="flex items-center gap-3">
            <a
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-blue-200 bg-brand-blue-50 text-brand-blue-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-blue-100 hover:border-brand-blue-300"
              href="#"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-orange-200 bg-brand-orange-50 text-brand-orange-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-orange-100 hover:border-brand-orange-300"
              href="#"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-blue-200 bg-brand-blue-50 text-brand-blue-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-blue-100 hover:border-brand-blue-300"
              href="#"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

