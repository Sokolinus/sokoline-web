"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Cart } from "@/lib/types";
import { fetchCart, addToCart, removeFromCart, updateCartItem } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: number, quantity?: number) => Promise<void>;
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
        // Add timestamp to avoid browser caching
        const data = await fetchCart(token);
        
        // Robust parsing for DRF responses
        let actualCart = null;
        if (Array.isArray(data)) {
          actualCart = data[0];
        } else if (data && typeof data === 'object') {
          if ('results' in data && Array.isArray(data.results)) {
            actualCart = data.results[0];
          } else if ('items' in data) {
            actualCart = data;
          }
        }
        
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

  const addItem = async (productId: number, quantity: number = 1) => {
    if (!isSignedIn) {
      toast("Sign in to add items to your cart.", "info");
      return;
    }

    try {
      const token = await getToken();
      if (token) {
        const success = await addToCart(token, productId, quantity);
        if (success) {
          await refreshCart();
          toast("Added to cart!", "success");
        }
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
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
