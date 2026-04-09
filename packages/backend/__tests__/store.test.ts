import { store } from "../src/store";

beforeEach(() => {
  store.reset();
});

describe("Store - Products", () => {
  it("returns seeded products", () => {
    const products = store.getProducts();
    expect(products.length).toBe(5);
    expect(products[0]).toEqual({
      id: "p1",
      name: "Wireless Mouse",
      price: 2999,
    });
  });

  it("finds a product by id", () => {
    expect(store.getProduct("p2")?.name).toBe("Mechanical Keyboard");
  });

  it("returns undefined for unknown product", () => {
    expect(store.getProduct("unknown")).toBeUndefined();
  });
});

describe("Store - Cart", () => {
  it("returns an empty cart for a new user", () => {
    const cart = store.getCart("user-1");
    expect(cart.userId).toBe("user-1");
    expect(cart.items).toEqual([]);
  });

  it("adds an item to the cart", () => {
    const cart = store.addToCart("user-1", "p1", 2);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toMatchObject({
      productId: "p1",
      name: "Wireless Mouse",
      price: 2999,
      quantity: 2,
    });
  });

  it("increments quantity when adding the same product again", () => {
    store.addToCart("user-1", "p1", 1);
    const cart = store.addToCart("user-1", "p1", 3);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(4);
  });

  it("throws when adding an unknown product", () => {
    expect(() => store.addToCart("user-1", "unknown", 1)).toThrow(
      "Product unknown not found"
    );
  });

  it("removes an item from the cart", () => {
    store.addToCart("user-1", "p1", 1);
    store.addToCart("user-1", "p2", 1);
    const cart = store.removeFromCart("user-1", "p1");
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].productId).toBe("p2");
  });

  it("clears a cart", () => {
    store.addToCart("user-1", "p1", 1);
    store.clearCart("user-1");
    const cart = store.getCart("user-1");
    expect(cart.items).toEqual([]);
  });
});

describe("Store - Orders", () => {
  it("starts with zero order count", () => {
    expect(store.getOrderCount()).toBe(0);
  });

  it("increments order count", () => {
    expect(store.incrementOrderCount()).toBe(1);
    expect(store.incrementOrderCount()).toBe(2);
    expect(store.getOrderCount()).toBe(2);
  });

  it("stores and retrieves orders", () => {
    const order = {
      id: "order-1",
      userId: "user-1",
      items: [{ productId: "p1", name: "Wireless Mouse", price: 2999, quantity: 1 }],
      subtotal: 2999,
      discountAmount: 0,
      total: 2999,
      createdAt: new Date(),
    };
    store.addOrder(order);
    expect(store.getOrders()).toHaveLength(1);
    expect(store.getOrders()[0].id).toBe("order-1");
  });
});

describe("Store - Discount Codes", () => {
  it("stores and retrieves a discount code", () => {
    const discount = {
      code: "DISCOUNT-ABC123",
      discountPercent: 10,
      used: false,
      createdAt: new Date(),
    };
    store.addDiscountCode(discount);
    expect(store.getDiscountCode("DISCOUNT-ABC123")).toEqual(discount);
  });

  it("returns undefined for unknown discount code", () => {
    expect(store.getDiscountCode("NOPE")).toBeUndefined();
  });

  it("marks a discount code as used", () => {
    store.addDiscountCode({
      code: "DISCOUNT-XYZ",
      discountPercent: 10,
      used: false,
      createdAt: new Date(),
    });
    store.markDiscountUsed("DISCOUNT-XYZ", "order-1");
    const dc = store.getDiscountCode("DISCOUNT-XYZ");
    expect(dc?.used).toBe(true);
    expect(dc?.orderId).toBe("order-1");
  });

  it("tracks lastDiscountOrderCount", () => {
    expect(store.getLastDiscountOrderCount()).toBe(0);
    store.setLastDiscountOrderCount(5);
    expect(store.getLastDiscountOrderCount()).toBe(5);
  });
});

describe("Store - Stats", () => {
  it("returns zeroed stats when empty", () => {
    const stats = store.getStats();
    expect(stats).toEqual({
      totalItemsPurchased: 0,
      totalRevenue: 0,
      discountCodes: [],
      totalDiscountAmount: 0,
      totalOrders: 0,
    });
  });

  it("computes stats from orders and discount codes", () => {
    store.addOrder({
      id: "o1",
      userId: "user-1",
      items: [
        { productId: "p1", name: "Wireless Mouse", price: 2999, quantity: 2 },
        { productId: "p2", name: "Mechanical Keyboard", price: 7999, quantity: 1 },
      ],
      subtotal: 13997,
      discountCode: "DISCOUNT-A",
      discountAmount: 1400,
      total: 12597,
      createdAt: new Date(),
    });
    store.addDiscountCode({
      code: "DISCOUNT-A",
      discountPercent: 10,
      used: true,
      orderId: "o1",
      createdAt: new Date(),
    });

    const stats = store.getStats();
    expect(stats.totalItemsPurchased).toBe(3);
    expect(stats.totalRevenue).toBe(12597);
    expect(stats.totalDiscountAmount).toBe(1400);
    expect(stats.totalOrders).toBe(1);
    expect(stats.discountCodes).toEqual([{ code: "DISCOUNT-A", used: true }]);
  });
});

describe("Store - Reset", () => {
  it("resets all state to initial values", () => {
    store.addToCart("user-1", "p1", 1);
    store.incrementOrderCount();
    store.reset();

    expect(store.getCart("user-1").items).toEqual([]);
    expect(store.getOrderCount()).toBe(0);
    expect(store.getOrders()).toEqual([]);
    expect(store.getProducts()).toHaveLength(5);
  });
});
