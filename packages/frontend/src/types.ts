export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount: number;
  total: number;
  createdAt: string;
}

export interface StoreStats {
  totalItemsPurchased: number;
  totalRevenue: number;
  discountCodes: { code: string; used: boolean }[];
  totalDiscountAmount: number;
  totalOrders: number;
}
