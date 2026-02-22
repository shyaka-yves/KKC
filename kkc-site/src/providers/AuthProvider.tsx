"use client";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getFirebaseAuth, getFirebaseDb, googleProvider } from "@/lib/firebase/client";

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

async function ensureUserDoc(user: User) {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      updatedAt: Date.now()
    },
    { merge: true }
  );
}

async function fetchIsAdmin(uid: string) {
  const db = getFirebaseDb();
  if (!db) return false;
  const snap = await getDoc(doc(db, "roles", uid));
  if (!snap.exists()) return false;
  const data = snap.data() as { role?: string; admin?: boolean } | undefined;
  return data?.admin === true || data?.role === "admin";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = getFirebaseAuth();
  const isEnabled = !!auth;

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(() => (auth ? true : false));

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
      if (!nextUser) {
        setIsAdmin(false);
        return;
      }

      try {
        await ensureUserDoc(nextUser);
        const admin = await fetchIsAdmin(nextUser.uid);
        setIsAdmin(admin);
      } catch {
        setIsAdmin(false);
      }
    });

    return () => unsub();
  }, [auth]);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) return;
    const provider: GoogleAuthProvider = googleProvider;
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  }, [auth]);

  const signInWithEmailPassword = useCallback(
    async (email: string, password: string) => {
      if (!auth) return;
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) return;

      try {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      } catch (error) {
        const err = error as { code?: string };
        if (err.code === "auth/user-not-found") {
          await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        } else {
          throw error;
        }
      }
    },
    [auth]
  );

  const signOutUser = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
  }, [auth]);

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

