import { useState, useCallback } from "react";
import type { Cart } from "../types";
import { api } from "../api/client";

export function useCart(userId: string) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCart(userId);
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addToCart = useCallback(
    async (productId: string, quantity: number) => {
      setError(null);
      try {
        const data = await api.addToCart(userId, productId, quantity);
        setCart(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add to cart");
      }
    },
    [userId]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      setError(null);
      try {
        const data = await api.removeFromCart(userId, productId);
        setCart(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to remove from cart"
        );
      }
    },
    [userId]
  );

  return { cart, loading, error, fetchCart, addToCart, removeFromCart, setCart };
}
