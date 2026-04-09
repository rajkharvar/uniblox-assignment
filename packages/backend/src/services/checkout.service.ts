import { v4 as uuidv4 } from "uuid";
import { Order } from "../models";
import { store } from "../store";
import { AppError } from "../middleware/error-handler";

export function checkout(userId: string, discountCode?: string): Order {
  const cart = store.getCart(userId);

  if (cart.items.length === 0) {
    throw new AppError(400, "Cart is empty");
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let discountAmount = 0;

  if (discountCode) {
    const discount = store.getDiscountCode(discountCode);

    if (!discount) {
      throw new AppError(400, "Invalid discount code");
    }

    if (discount.used) {
      throw new AppError(400, "Discount code has already been used");
    }

    discountAmount = Math.floor((subtotal * discount.discountPercent) / 100);
  }

  const total = subtotal - discountAmount;
  store.incrementOrderCount();

  const order: Order = {
    id: uuidv4(),
    userId,
    items: [...cart.items],
    subtotal,
    discountCode,
    discountAmount,
    total,
    createdAt: new Date(),
  };

  store.addOrder(order);

  if (discountCode) {
    store.markDiscountUsed(discountCode, order.id);
  }

  store.clearCart(userId);

  return order;
}
