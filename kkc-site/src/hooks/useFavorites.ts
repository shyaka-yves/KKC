"use client";

import { useEffect, useState } from "react";

import { listenFavorites } from "@/lib/firestore/favorites";
import { useAuth } from "@/providers/AuthProvider";

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    const unsub = listenFavorites(user.uid, setFavoriteIds);
    return () => unsub?.();
  }, [user]);

  return { favoriteIds: user ? favoriteIds : new Set<string>() };
}

