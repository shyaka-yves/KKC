"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Hero({
  localeBase,
  headline,
  subheadline,
  ctaBrowseLabel,
  ctaWhatsAppLabel
}: {
  localeBase: string;
  headline: string;
  subheadline: string;
  ctaBrowseLabel: string;
  ctaWhatsAppLabel: string;
}) {
  return (
    <section className="relative overflow-hidden hero-bg">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-blue-500/35 via-brand-blue-600/25 to-brand-orange-500/35 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.35),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 md:pb-20 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-7 md:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-white/10" />

          <div className="relative z-10 grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/50 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brand-blue-800 uppercase">
                Premium construction supply
              </p>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 md:text-6xl">
                {headline}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                {subheadline}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={`${localeBase}/products`}
                    className={cn(
                      "inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-brand-blue-600 to-brand-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue-600/25 transition hover:from-brand-blue-500 hover:to-brand-blue-700 sm:w-auto"
                    )}
                  >
                    {ctaBrowseLabel}
                  </Link>
                </motion.div>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://wa.me/250788318876?text=Hello%20KKC,%20I%20am%20interested%20in%20your%20construction%20materials."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-brand-orange-500 to-brand-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-orange-500/25 transition hover:from-brand-orange-400 hover:to-brand-orange-600 sm:w-auto"
                >
                  {ctaWhatsAppLabel}
                </motion.a>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-b from-white/60 to-white/20 p-6 shadow-[0_30px_80px_-45px_rgba(2,6,23,0.6)] backdrop-blur-xl">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-blue-500/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-orange-500/20 blur-2xl" />

                <div className="relative space-y-4">
                  <div className="text-sm font-semibold text-slate-950">
                    What we supply
                  </div>
                  <ul className="grid gap-3 text-sm text-slate-700">
                    <li className="flex items-center justify-between rounded-xl bg-white/55 px-4 py-3">
                      <span>Concrete & cement</span>
                      <span className="text-xs font-semibold text-brand-blue-800">
                        Premium
                      </span>
                    </li>
                    <li className="flex items-center justify-between rounded-xl bg-white/55 px-4 py-3">
                      <span>Steel & reinforcement</span>
                      <span className="text-xs font-semibold text-brand-blue-800">
                        Trusted
                      </span>
                    </li>
                    <li className="flex items-center justify-between rounded-xl bg-white/55 px-4 py-3">
                      <span>Tiles & finishing</span>
                      <span className="text-xs font-semibold text-brand-blue-800">
                        Modern
                      </span>
                    </li>
                    <li className="flex items-center justify-between rounded-xl bg-white/55 px-4 py-3">
                      <span>Plumbing & electrical</span>
                      <span className="text-xs font-semibold text-brand-blue-800">
                        Complete
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

