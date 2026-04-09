import { store } from "../src/store";
import * as cartService from "../src/services/cart.service";

beforeEach(() => {
  store.reset();
});

describe("CartService", () => {
  it("returns an empty cart for a new user", () => {
    const cart = cartService.getCart("user-1");
    expect(cart.items).toEqual([]);
  });

  it("adds a valid item to the cart", () => {
    const cart = cartService.addToCart("user-1", "p1", 2);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toMatchObject({
      productId: "p1",
      quantity: 2,
    });
  });

  it("increments quantity when adding the same product", () => {
    cartService.addToCart("user-1", "p1", 1);
    const cart = cartService.addToCart("user-1", "p1", 3);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(4);
  });

  it("throws for quantity <= 0", () => {
    expect(() => cartService.addToCart("user-1", "p1", 0)).toThrow(
      "Quantity must be greater than zero"
    );
    expect(() => cartService.addToCart("user-1", "p1", -1)).toThrow(
      "Quantity must be greater than zero"
    );
  });

  it("throws for unknown product", () => {
    expect(() => cartService.addToCart("user-1", "unknown", 1)).toThrow(
      "Product unknown not found"
    );
  });

  it("removes an item from the cart", () => {
    cartService.addToCart("user-1", "p1", 1);
    cartService.addToCart("user-1", "p2", 1);
    const cart = cartService.removeFromCart("user-1", "p1");
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].productId).toBe("p2");
  });
});
