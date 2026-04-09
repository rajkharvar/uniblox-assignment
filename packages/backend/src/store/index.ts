import { Product, Cart, Order, DiscountCode, StoreStats } from "../models";
import { SEED_PRODUCTS } from "../data/products";

interface StoreState {
  products: Product[];
  carts: Map<string, Cart>;
  orders: Order[];
  discountCodes: Map<string, DiscountCode>;
  orderCount: number;
  lastDiscountOrderCount: number;
}

class Store {
  private state: StoreState;

  constructor() {
    this.state = this.initialState();
  }

  private initialState(): StoreState {
    return {
      products: [...SEED_PRODUCTS],
      carts: new Map(),
      orders: [],
      discountCodes: new Map(),
      orderCount: 0,
      lastDiscountOrderCount: 0,
    };
  }

  // Products

  getProducts(): Product[] {
    return this.state.products;
  }

  getProduct(id: string): Product | undefined {
    return this.state.products.find((p) => p.id === id);
  }

  // Carts

  getCart(userId: string): Cart {
    const existing = this.state.carts.get(userId);
    if (existing) return existing;

    const cart: Cart = { userId, items: [], createdAt: new Date() };
    this.state.carts.set(userId, cart);
    return cart;
  }

  addToCart(userId: string, productId: string, quantity: number): Cart {
    const cart = this.getCart(userId);
    const existingItem = cart.items.find((i) => i.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const product = this.getProduct(productId);
      if (!product) throw new Error(`Product ${productId} not found`);

      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    return cart;
  }

  removeFromCart(userId: string, productId: string): Cart {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter((i) => i.productId !== productId);
    return cart;
  }

  clearCart(userId: string): void {
    this.state.carts.delete(userId);
  }

  // Orders

  addOrder(order: Order): void {
    this.state.orders.push(order);
  }

  getOrders(): Order[] {
    return this.state.orders;
  }

  getOrderCount(): number {
    return this.state.orderCount;
  }

  incrementOrderCount(): number {
    return ++this.state.orderCount;
  }

  // Discount codes

  addDiscountCode(discount: DiscountCode): void {
    this.state.discountCodes.set(discount.code, discount);
  }

  getDiscountCode(code: string): DiscountCode | undefined {
    return this.state.discountCodes.get(code);
  }

  markDiscountUsed(code: string, orderId: string): void {
    const discount = this.state.discountCodes.get(code);
    if (discount) {
      discount.used = true;
      discount.orderId = orderId;
    }
  }

  getLastDiscountOrderCount(): number {
    return this.state.lastDiscountOrderCount;
  }

  setLastDiscountOrderCount(n: number): void {
    this.state.lastDiscountOrderCount = n;
  }

  // Stats

  getStats(): StoreStats {
    const totalItemsPurchased = this.state.orders.reduce(
      (sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );

    const totalRevenue = this.state.orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const discountCodes = Array.from(this.state.discountCodes.values()).map(
      (dc) => ({ code: dc.code, used: dc.used })
    );

    const totalDiscountAmount = this.state.orders.reduce(
      (sum, order) => sum + order.discountAmount,
      0
    );

    return {
      totalItemsPurchased,
      totalRevenue,
      discountCodes,
      totalDiscountAmount,
      totalOrders: this.state.orders.length,
    };
  }

  // Testing

  reset(): void {
    this.state = this.initialState();
  }
}

export const store = new Store();
