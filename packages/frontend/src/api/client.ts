import type { Product, Cart, Order, StoreStats } from "../types";

const BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export const api = {
  getProducts: () =>
    request<{ products: Product[] }>("/products").then((d) => d.products),

  getCart: (userId: string) =>
    request<{ cart: Cart }>(`/cart/${userId}`).then((d) => d.cart),

  addToCart: (userId: string, productId: string, quantity: number) =>
    request<{ cart: Cart }>(`/cart/${userId}/items`, {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }).then((d) => d.cart),

  removeFromCart: (userId: string, productId: string) =>
    request<{ cart: Cart }>(`/cart/${userId}/items/${productId}`, {
      method: "DELETE",
    }).then((d) => d.cart),

  checkout: (userId: string, discountCode?: string) =>
    request<{ order: Order }>("/checkout", {
      method: "POST",
      body: JSON.stringify({ userId, discountCode: discountCode || undefined }),
    }).then((d) => d.order),

  generateDiscount: () =>
    request<{ code: string | null; discountPercent: number; message: string }>(
      "/admin/generate-discount",
      { method: "POST" }
    ),

  getStats: () => request<StoreStats>("/admin/stats"),
};
