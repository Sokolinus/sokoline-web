"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Cart } from "@/lib/types";
import { fetchCart, addToCart, removeFromCart, updateCartItem } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: number, quantity?: number) => Promise<boolean>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();

  const refreshCart = useCallback(async () => {
    if (!isSignedIn) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      if (token) {
        const data = await fetchCart(token);
        console.log("[Cart] Raw data from API:", data);
        
        // Robust parsing for DRF responses
        let actualCart = null;
        if (Array.isArray(data)) {
          actualCart = data[0];
        } else if (data && typeof data === 'object' && data !== null) {
          if ('results' in data && Array.isArray((data as any).results)) {
            actualCart = (data as any).results[0];
          } else if ('items' in data) {
            actualCart = data;
          }
        }
        
        console.log("[Cart] Parsed cart object:", actualCart);
        setCart(actualCart || null);
      }
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshCart();
    }
  }, [isLoaded, isSignedIn, refreshCart]);

  const addItem = async (productId: number, quantity: number = 1): Promise<boolean> => {
    if (!isSignedIn) {
      toast("Sign in to add items to your cart.", "info");
      return false;
    }

    const errorMsg = "Could not add item to cart. Please try again.";
    try {
      const token = await getToken();
      console.log("[Cart] Token obtained:", !!token);
      if (token) {
        console.log(`[Cart] Adding product ID: ${productId}, quantity: ${quantity}`);
        const result = await addToCart(token, productId, quantity);
        console.log("[Cart] Result:", result);
        if (result.success) {
          await refreshCart();
          toast("Added to cart!", "success");
          return true;
        }

        if (result.status === 401 || result.status === 403) {
          toast("Your session has expired. Please sign in again.", "info");
          return false;
        }

        if (result.status === 400) {
          toast(result.message || "Invalid add-to-cart request.", "error");
          return false;
        }

        toast(result.message || errorMsg, "error");
        return false;
      }

      toast("Please sign in again to continue.", "info");
      return false;
    } catch (error) {
      console.error("Failed to add item:", error);
      toast(errorMsg, "error");
    }
    return false;
  };

  const removeItem = async (itemId: number) => {
    try {
      const token = await getToken();
      if (token) {
        const success = await removeFromCart(token, itemId);
        if (success) {
          await refreshCart();
        }
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const token = await getToken();
      if (token) {
        const success = await updateCartItem(token, itemId, quantity);
        if (success) {
          await refreshCart();
        }
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, removeItem, updateQuantity, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
