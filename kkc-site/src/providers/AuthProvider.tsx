"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  isEnabled: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function fetchIsAdmin(uid: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data } = await sb.from("roles").select("role, admin").eq("user_id", uid).maybeSingle();
  const row = data as { role?: string | null; admin?: boolean | null } | null;
  return row?.admin === true || row?.role === "admin";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isEnabled = isSupabaseConfigured();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    // Attempt to get a persistence hint from localStorage to avoid "Loading..." flash
    if (typeof window !== "undefined") {
      return localStorage.getItem("kkc_is_admin") === "true";
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(isEnabled);

  // Update persistence hint whenever isAdmin changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kkc_is_admin", isAdmin ? "true" : "false");
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isEnabled) {
      setIsLoading(false);
      return;
    }
    const sb = getSupabase();
    if (!sb) {
      setIsLoading(false);
      return;
    }

    const {
      data: { subscription }
    } = sb.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Change:", event, !!session);
      if (!session?.user) {
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      setUser({
        uid: session.user.id,
        email: session.user.email ?? null,
        displayName: session.user.user_metadata?.full_name ?? session.user.email ?? null,
        photoURL: session.user.user_metadata?.avatar_url ?? null
      });
      try {
        const admin = await fetchIsAdmin(session.user.id);
        setIsAdmin(admin);
      } catch (err) {
        console.error("Admin check error:", err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    });

    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email ?? null,
          displayName: session.user.user_metadata?.full_name ?? session.user.email ?? null,
          photoURL: session.user.user_metadata?.avatar_url ?? null
        });
        try {
          const admin = await fetchIsAdmin(session.user.id);
          setIsAdmin(admin);
        } catch (err) {
          console.error("Initial session admin check error:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    }).catch(err => {
      console.error("Session retrieval error:", err);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isEnabled]);

  const signInWithGoogle = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;

    // Detect locale from current URL
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    const segments = currentPath.split("/");
    const locale = segments.find((s) => s === "en" || s === "rw") || "en";

    const origin = typeof window !== "undefined" ? window.location.origin : "";

    // Redirect customers to products after login
    const redirectTo = `${origin}/api/auth/callback?next=/${locale}/products`;
    console.log("Signing in with Google, redirecting to:", redirectTo);

    await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo
      }
    });
  }, []);

  const signInWithEmailPassword = useCallback(
    async (email: string, password: string) => {
      const sb = getSupabase();
      if (!sb) return;
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) return;

      const { error } = await sb.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });
      if (error?.message?.includes("Invalid login")) {
        const { error: signUpError } = await sb.auth.signUp({
          email: trimmedEmail,
          password
        });
        if (signUpError) throw signUpError;
      } else if (error) throw error;
    },
    []
  );

  const signOutUser = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    if (typeof window !== "undefined") {
      localStorage.removeItem("kkc_is_admin");
    }
    await sb.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAdmin,
      isLoading,
      isEnabled,
      signInWithGoogle,
      signInWithEmailPassword,
      signOutUser
    }),
    [user, isAdmin, isLoading, isEnabled, signInWithGoogle, signInWithEmailPassword, signOutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
