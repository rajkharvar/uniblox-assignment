import { useState } from "react";
import type { Cart, Order } from "../types";
import { api } from "../api/client";

interface Props {
  cart: Cart | null;
  onRemove: (productId: string) => void;
  onCheckoutComplete: (order: Order) => void;
  userId: string;
}

export function CartView({ cart, onRemove, onCheckoutComplete, userId }: Props) {
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const subtotal =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  const handleCheckout = async () => {
    setError(null);
    setChecking(true);
    try {
      const order = await api.checkout(
        userId,
        discountCode.trim() || undefined
      );
      setDiscountCode("");
      onCheckoutComplete(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setChecking(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <h2>Cart</h2>
        <p className="empty-state">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Cart</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.productId}>
              <td>{item.name}</td>
              <td>{formatPrice(item.price)}</td>
              <td>{item.quantity}</td>
              <td>{formatPrice(item.price * item.quantity)}</td>
              <td>
                <button
                  className="btn-small btn-danger"
                  onClick={() => onRemove(item.productId)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-footer">
        <p className="cart-total">Total: {formatPrice(subtotal)}</p>

        <div className="discount-row">
          <input
            type="text"
            placeholder="Discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button onClick={handleCheckout} disabled={checking}>
            {checking ? "Processing..." : "Checkout"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
