import { store } from "../src/store";
import * as adminService from "../src/services/admin.service";
import { config } from "../src/config";

beforeEach(() => {
  store.reset();
});

describe("AdminService - generateDiscount", () => {
  it("returns null when no orders placed", () => {
    const result = adminService.generateDiscount();
    expect(result.code).toBeNull();
    expect(result.message).toContain(`order #${config.NTH_ORDER}`);
  });

  it("returns null when order count is not a multiple of n", () => {
    for (let i = 0; i < config.NTH_ORDER - 1; i++) {
      store.incrementOrderCount();
    }
    const result = adminService.generateDiscount();
    expect(result.code).toBeNull();
  });

  it("generates a code when order count is a multiple of n", () => {
    for (let i = 0; i < config.NTH_ORDER; i++) {
      store.incrementOrderCount();
    }
    const result = adminService.generateDiscount();
    expect(result.code).not.toBeNull();
    expect(result.code).toMatch(/^DISCOUNT-[A-F0-9]{8}$/);
    expect(result.discountPercent).toBe(config.DISCOUNT_PERCENT);
  });

  it("does not generate duplicate code for the same nth order", () => {
    for (let i = 0; i < config.NTH_ORDER; i++) {
      store.incrementOrderCount();
    }

    const first = adminService.generateDiscount();
    expect(first.code).not.toBeNull();

    const second = adminService.generateDiscount();
    expect(second.code).toBeNull();
  });

  it("generates a new code for the next nth order", () => {
    // Reach nth order
    for (let i = 0; i < config.NTH_ORDER; i++) {
      store.incrementOrderCount();
    }
    const first = adminService.generateDiscount();
    expect(first.code).not.toBeNull();

    // Reach 2*nth order
    for (let i = 0; i < config.NTH_ORDER; i++) {
      store.incrementOrderCount();
    }
    const second = adminService.generateDiscount();
    expect(second.code).not.toBeNull();
    expect(second.code).not.toBe(first.code);
  });

  it("stores the generated discount code", () => {
    for (let i = 0; i < config.NTH_ORDER; i++) {
      store.incrementOrderCount();
    }

    const result = adminService.generateDiscount();
    const stored = store.getDiscountCode(result.code!);
    expect(stored).toBeDefined();
    expect(stored?.discountPercent).toBe(config.DISCOUNT_PERCENT);
    expect(stored?.used).toBe(false);
  });
});

describe("AdminService - getStats", () => {
  it("returns zeroed stats when empty", () => {
    const stats = adminService.getStats();
    expect(stats.totalItemsPurchased).toBe(0);
    expect(stats.totalRevenue).toBe(0);
    expect(stats.totalOrders).toBe(0);
    expect(stats.discountCodes).toEqual([]);
    expect(stats.totalDiscountAmount).toBe(0);
  });

  it("returns correct stats after orders", () => {
    store.addOrder({
      id: "o1",
      userId: "user-1",
      items: [
        { productId: "p1", name: "Wireless Mouse", price: 2999, quantity: 3 },
      ],
      subtotal: 8997,
      discountAmount: 0,
      total: 8997,
      createdAt: new Date(),
    });

    store.addOrder({
      id: "o2",
      userId: "user-2",
      items: [
        { productId: "p2", name: "Mechanical Keyboard", price: 7999, quantity: 1 },
      ],
      subtotal: 7999,
      discountCode: "CODE-A",
      discountAmount: 800,
      total: 7199,
      createdAt: new Date(),
    });

    store.addDiscountCode({
      code: "CODE-A",
      discountPercent: 10,
      used: true,
      orderId: "o2",
      createdAt: new Date(),
    });

    const stats = adminService.getStats();
    expect(stats.totalItemsPurchased).toBe(4);
    expect(stats.totalRevenue).toBe(16196);
    expect(stats.totalOrders).toBe(2);
    expect(stats.totalDiscountAmount).toBe(800);
    expect(stats.discountCodes).toEqual([{ code: "CODE-A", used: true }]);
  });
});
