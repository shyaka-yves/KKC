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
  const { data } = await sb.from("roles").select("role, admin").eq("user_id", uid).single();
  const row = data as { role?: string | null; admin?: boolean | null } | null;
  return row?.admin === true || row?.role === "admin";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isEnabled = isSupabaseConfigured();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(isEnabled);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    const sb = getSupabase();
    if (!sb) return;

    const {
      data: { subscription }
    } = sb.auth.onAuthStateChange(async (_event, session) => {
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
      } catch {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email ?? null,
          displayName: session.user.user_metadata?.full_name ?? session.user.email ?? null,
          photoURL: session.user.user_metadata?.avatar_url ?? null
        });
        fetchIsAdmin(session.user.id).then(setIsAdmin);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isEnabled]);

  const signInWithGoogle = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signInWithOAuth({ provider: "google" });
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
    await sb.auth.signOut();
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
