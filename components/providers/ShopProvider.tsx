"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop } from "@/lib/api";
import { Shop } from "@/lib/types";

interface ShopContextType {
  shop: Shop | null;
  loading: boolean;
  hasShop: boolean;
  refetchShop: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const refetchShop = useCallback(async () => {
    if (!isSignedIn) {
      setShop(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      if (token) {
        const data = await fetchMyShop(token);
        setShop(data);
      }
    } catch {
      setShop(null);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refetchShop();
    }
  }, [isLoaded, isSignedIn, refetchShop]);

  return (
    <ShopContext.Provider value={{ shop, loading, hasShop: !!shop, refetchShop }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
