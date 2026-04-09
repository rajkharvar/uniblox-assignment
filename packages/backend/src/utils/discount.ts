import { randomBytes } from "crypto";

export function generateDiscountCode(): string {
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `DISCOUNT-${suffix}`;
}
