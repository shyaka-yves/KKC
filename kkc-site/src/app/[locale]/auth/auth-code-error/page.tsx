"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

import { useAuth } from "@/providers/AuthProvider";

export default function AuthCodeErrorPage() {
    const t = useTranslations();
    const router = useRouter();
    const { isAdmin } = useAuth();
    const [recovering, setRecovering] = useState(true);

    useEffect(() => {
        async function attemptRecovery() {
            // Supabase sometimes redirects with a fragment (#access_token=...) 
            // instead of a query param (code=...). This happens in implicit flow.
            // Server-side code cannot see fragments, so we check it here client-side.
            const hash = window.location.hash;
            if (hash && hash.includes("access_token")) {
                try {
                    const sb = getSupabase();
                    if (sb) {
                        // The Supabase client automatically parses the fragment in getSession
                        // but we can also trigger a refresh or just check if we have a session now.
                        const { data: { session } } = await sb.auth.getSession();
                        if (session) {
                            console.log("Session recovered from fragment, checking role...");
                            // Small delay to let AuthProvider sync the isAdmin state if it's currently checking
                            setTimeout(() => {
                                if (isAdmin) {
                                    router.replace("/admin");
                                } else {
                                    router.replace("/");
                                }
                            }, 800);
                            return;
                        }
                    }
                } catch (err) {
                    console.error("Recovery failed:", err);
                }
            }
            setRecovering(false);
        }

        attemptRecovery();
    }, [router, isAdmin]);

    if (recovering) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-brand-blue-50 px-4 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-brand-blue-600" />
                <p className="mt-4 text-sm text-slate-600">Verifying session...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-brand-blue-50 px-4 py-12 text-center">
            <div className="mb-8 flex items-center gap-2">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-b from-brand-blue-600 to-brand-blue-700 text-white shadow-lg shadow-brand-blue-600/25">
                    <Sparkles className="h-6 w-6" />
                </span>
                <span className="text-xl font-bold tracking-tight text-slate-950">KKC</span>
            </div>

            <div className="w-full max-w-md rounded-3xl border-2 border-brand-blue-200 bg-white p-8 shadow-xl md:p-12">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                    Auth Error
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                    Something went wrong while trying to sign you in. This could be due to an expired link or a configuration issue.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-brand-blue-600 to-brand-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue-600/25 transition hover:from-brand-blue-500 hover:to-brand-blue-700"
                    >
                        Back to Home
                    </Link>
                    <p className="text-xs text-slate-500 mt-2">
                        If this persists, please contact support or try a different sign-in method.
                    </p>
                </div>
            </div>
        </div>
    );
}
