import { Cart } from "../models";
import { store } from "../store";
import { AppError } from "../middleware/error-handler";

export function getCart(userId: string): Cart {
  return store.getCart(userId);
}

export function addToCart(
  userId: string,
  productId: string,
  quantity: number
): Cart {
  if (quantity <= 0) {
    throw new AppError(400, "Quantity must be greater than zero");
  }

  const product = store.getProduct(productId);
  if (!product) {
    throw new AppError(404, `Product ${productId} not found`);
  }

  return store.addToCart(userId, productId, quantity);
}

export function removeFromCart(userId: string, productId: string): Cart {
  return store.removeFromCart(userId, productId);
}
