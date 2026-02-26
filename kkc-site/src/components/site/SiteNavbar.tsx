"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { LogIn, Menu, Shield, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { useAdminSession } from "@/hooks/useAdminSession";
import { useAuth } from "@/providers/AuthProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LoginModal } from "./LoginModal";

function NavLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-full px-3 py-2 text-sm font-medium transition",
        isActive
          ? "text-white"
          : "text-slate-700 hover:text-brand-blue-700"
      )}
    >
      <span className="relative z-10">{children}</span>
      {isActive ? (
        <span className="absolute inset-0 -z-0 rounded-full bg-brand-blue-600 shadow-md shadow-brand-blue-600/30" />
      ) : null}
    </Link>
  );
}

export function SiteNavbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { user, signOutUser, isAdmin } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0.12, 0.38]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0.55, 0.82]);

  const base = useMemo(() => `/${locale}`, [locale]);
  const links = useMemo(
    () => [
      { href: `${base}`, label: t("nav.home") },
      { href: `${base}/products`, label: t("nav.products") },
      { href: `${base}/about`, label: t("nav.about") },
      { href: `${base}/contact`, label: t("nav.contact") }
    ],
    [base, t]
  );

  // Keep locale segment even on unknown paths.
  const isOnAdmin = pathname?.includes("/admin");

  return (
    <>
      <motion.header
        className="sticky top-0 z-40"
        style={{
          borderColor: borderOpacity as unknown as string,
          backgroundColor: bgOpacity as unknown as string
        }}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-brand-blue-50/90 backdrop-blur-xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-blue-200/80 to-transparent" />

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href={`${base}`} className="group flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-brand-blue-600 to-brand-blue-700 text-white shadow-lg shadow-brand-blue-600/25 transition group-hover:shadow-brand-blue-600/35">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-slate-950">
                {t("brand.name")}
              </div>
              <div className="text-xs text-slate-600">{t("brand.location")}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border-2 border-brand-blue-200 bg-white/70 p-1 shadow-sm md:flex">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href}>
                {l.label}
              </NavLink>
            ))}
            {isOnAdmin && isAdmin ? (
              <NavLink href={`${base}/admin`}>{t("nav.dashboard")}</NavLink>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:inline-flex" />

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-blue-200 bg-brand-blue-50 text-brand-blue-700 shadow-sm transition hover:bg-brand-blue-100 md:hidden"
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {user || isAdmin ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Link
                    href={`${base}/admin`}
                    className="hidden items-center gap-2 rounded-full bg-gradient-to-b from-brand-orange-500 to-brand-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-brand-orange-500/25 transition hover:from-brand-orange-400 hover:to-brand-orange-600 sm:inline-flex"
                  >
                    <Shield className="h-4 w-4" />
                    {t("nav.dashboard")}
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-brand-blue-200 bg-brand-blue-50 px-3 py-2 text-sm font-medium text-brand-blue-700 shadow-sm transition hover:bg-brand-blue-100 hover:border-brand-blue-300"
                >
                  <span className="hidden sm:inline">{t("auth.signOut")}</span>
                  <span className="inline sm:hidden">↩</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-brand-blue-600 to-brand-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-blue-600/25 transition hover:from-brand-blue-500 hover:to-brand-blue-700"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.login")}</span>
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="mx-auto max-w-6xl px-4 pb-3">
                <div className="glass rounded-2xl p-3">
                  <div className="grid gap-1">
                    {links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-brand-blue-50 hover:text-brand-blue-700"
                      >
                        {l.label}
                      </Link>
                    ))}
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-white/55 px-3 py-2">
                      <div className="text-xs font-semibold tracking-[0.14em] text-slate-600 uppercase">
                        Language
                      </div>
                      <LanguageSwitcher className="sm:hidden" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

