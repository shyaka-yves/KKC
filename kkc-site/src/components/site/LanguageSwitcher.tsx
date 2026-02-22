"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMemo, useTransition } from "react";

import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function switchLocalePathname(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${nextLocale}`;
  if (locales.includes(segments[0] as Locale)) {
    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  }
  return `/${nextLocale}/${segments.join("/")}`;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [, startTransition] = useTransition();

  const nextLocale = useMemo<Locale>(() => (locale === "en" ? "rw" : "en"), [locale]);
  const label = nextLocale === "en" ? "EN" : "RW";

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => {
          router.push(switchLocalePathname(pathname, nextLocale));
        });
      }}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border-2 border-brand-blue-200 bg-brand-blue-50 px-3 py-2 text-sm font-semibold text-brand-blue-700 shadow-sm transition hover:bg-brand-blue-100 hover:border-brand-blue-300",
        className
      )}
      aria-label={`Switch language to ${label}`}
    >
      <Languages className="h-4 w-4 text-brand-blue-600 transition group-hover:rotate-6" />
      <span className="tracking-wide">{label}</span>
    </button>
  );
}

