"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

export function LoginModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const { signInWithGoogle, isEnabled } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isEnabled) {
      setError("Login is not available at the moment. Please try again later.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <button
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close"
          />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/25 bg-white/80 p-6 shadow-[0_30px_90px_-35px_rgba(2,6,23,0.65)] backdrop-blur-xl md:p-7"
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-slate-800 transition hover:bg-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2 pr-10">
              <p className="text-xs font-semibold tracking-[0.14em] text-brand-blue-700 uppercase">
                {t("brand.name")}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {t("auth.signInTitle")}
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                {t("auth.signInSubtitle")}
              </p>
            </div>

            <div className="mt-6">
              <div className="rounded-2xl bg-white/70 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue-600 text-white">
                    <Users className="h-4 w-4" />
                  </span>
                  <span>Customers & staff</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Sign in with Google to save favourite products.
                </p>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className={cn(
                    "mt-4 w-full rounded-xl bg-gradient-to-b from-brand-blue-600 to-brand-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue-600/25 transition hover:from-brand-blue-500 hover:to-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-brand-blue-500/50 disabled:cursor-not-allowed disabled:opacity-70"
                  )}
                >
                  {loading ? "Signing in…" : t("auth.continueGoogle")}
                </button>
                {error ? (
                  <p className="mt-3 text-xs text-brand-orange-600">{error}</p>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

