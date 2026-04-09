import { DiscountCode, StoreStats } from "../models";
import { store } from "../store";
import { config } from "../config";
import { generateDiscountCode } from "../utils/discount";

interface DiscountResult {
  code: string | null;
  discountPercent: number;
  message: string;
}

export function generateDiscount(): DiscountResult {
  const orderCount = store.getOrderCount();
  const lastGenerated = store.getLastDiscountOrderCount();
  const { NTH_ORDER, DISCOUNT_PERCENT } = config;

  const isEligible =
    orderCount > 0 &&
    orderCount % NTH_ORDER === 0 &&
    orderCount > lastGenerated;

  if (!isEligible) {
    const nextAt =
      orderCount === 0
        ? NTH_ORDER
        : Math.ceil((orderCount + 1) / NTH_ORDER) * NTH_ORDER;

    return {
      code: null,
      discountPercent: DISCOUNT_PERCENT,
      message: `No discount code available. Next discount at order #${nextAt}.`,
    };
  }

  const code = generateDiscountCode();
  const discount: DiscountCode = {
    code,
    discountPercent: DISCOUNT_PERCENT,
    used: false,
    createdAt: new Date(),
  };

  store.addDiscountCode(discount);
  store.setLastDiscountOrderCount(orderCount);

  return {
    code,
    discountPercent: DISCOUNT_PERCENT,
    message: `Discount code generated for order #${orderCount}.`,
  };
}

export function getStats(): StoreStats {
  return store.getStats();
}
