export interface Product {
  id: string;
  name: string;
  price: number; // in cents
}

export interface CartItem {
  productId: string;
  name: string;
  price: number; // unit price in cents
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  createdAt: Date;
}

export interface DiscountCode {
  code: string;
  discountPercent: number;
  used: boolean;
  orderId?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number; // in cents
  discountCode?: string;
  discountAmount: number; // in cents
  total: number; // in cents
  createdAt: Date;
}

export interface StoreStats {
  totalItemsPurchased: number;
  totalRevenue: number;
  discountCodes: { code: string; used: boolean }[];
  totalDiscountAmount: number;
  totalOrders: number;
}
