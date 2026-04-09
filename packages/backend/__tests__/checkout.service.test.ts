import { store } from "../src/store";
import * as checkoutService from "../src/services/checkout.service";

beforeEach(() => {
  store.reset();
});

describe("CheckoutService", () => {
  it("throws when cart is empty", () => {
    expect(() => checkoutService.checkout("user-1")).toThrow("Cart is empty");
  });

  it("creates an order without discount", () => {
    store.addToCart("user-1", "p1", 2); // 2999 * 2 = 5998
    const order = checkoutService.checkout("user-1");

    expect(order.userId).toBe("user-1");
    expect(order.items).toHaveLength(1);
    expect(order.subtotal).toBe(5998);
    expect(order.discountAmount).toBe(0);
    expect(order.total).toBe(5998);
    expect(order.discountCode).toBeUndefined();
  });

  it("applies a valid discount code", () => {
    store.addDiscountCode({
      code: "TEST10",
      discountPercent: 10,
      used: false,
      createdAt: new Date(),
    });

    store.addToCart("user-1", "p1", 1); // 2999
    const order = checkoutService.checkout("user-1", "TEST10");

    expect(order.discountCode).toBe("TEST10");
    expect(order.discountAmount).toBe(299); // floor(2999 * 10 / 100)
    expect(order.total).toBe(2700);
  });

  it("throws for invalid discount code", () => {
    store.addToCart("user-1", "p1", 1);
    expect(() => checkoutService.checkout("user-1", "FAKE")).toThrow(
      "Invalid discount code"
    );
  });

  it("throws for already-used discount code", () => {
    store.addDiscountCode({
      code: "USED",
      discountPercent: 10,
      used: true,
      orderId: "old-order",
      createdAt: new Date(),
    });

    store.addToCart("user-1", "p1", 1);
    expect(() => checkoutService.checkout("user-1", "USED")).toThrow(
      "Discount code has already been used"
    );
  });

  it("increments order count after checkout", () => {
    store.addToCart("user-1", "p1", 1);
    checkoutService.checkout("user-1");
    expect(store.getOrderCount()).toBe(1);

    store.addToCart("user-2", "p2", 1);
    checkoutService.checkout("user-2");
    expect(store.getOrderCount()).toBe(2);
  });

  it("clears the cart after checkout", () => {
    store.addToCart("user-1", "p1", 1);
    checkoutService.checkout("user-1");
    const cart = store.getCart("user-1");
    expect(cart.items).toEqual([]);
  });

  it("marks discount code as used after checkout", () => {
    store.addDiscountCode({
      code: "ONCE",
      discountPercent: 15,
      used: false,
      createdAt: new Date(),
    });

    store.addToCart("user-1", "p1", 1);
    const order = checkoutService.checkout("user-1", "ONCE");

    const dc = store.getDiscountCode("ONCE");
    expect(dc?.used).toBe(true);
    expect(dc?.orderId).toBe(order.id);
  });

  it("calculates correctly with multiple items", () => {
    store.addToCart("user-1", "p1", 2); // 2999 * 2 = 5998
    store.addToCart("user-1", "p3", 1); // 4999 * 1 = 4999
    // subtotal = 10997

    store.addDiscountCode({
      code: "MULTI",
      discountPercent: 10,
      used: false,
      createdAt: new Date(),
    });

    const order = checkoutService.checkout("user-1", "MULTI");
    expect(order.subtotal).toBe(10997);
    expect(order.discountAmount).toBe(1099); // floor(10997 * 10 / 100)
    expect(order.total).toBe(9898);
  });
});
