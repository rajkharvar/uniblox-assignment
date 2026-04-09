import { useState, useEffect } from "react";
import { useCart } from "./hooks/useCart";
import { ProductList } from "./components/ProductList";
import { CartView } from "./components/CartView";
import { AdminPanel } from "./components/AdminPanel";
import type { Order } from "./types";
import "./App.css";

type Tab = "shop" | "cart" | "admin";

const USER_ID = "user-1";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("shop");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const { cart, fetchCart, addToCart, removeFromCart, setCart } =
    useCart(USER_ID);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    await addToCart(productId, quantity);
    setActiveTab("cart");
  };

  const handleCheckoutComplete = (order: Order) => {
    setLastOrder(order);
    setCart(null);
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="app">
      <header>
        <h1>Uniblox Store</h1>
        <nav>
          <button
            className={activeTab === "shop" ? "active" : ""}
            onClick={() => setActiveTab("shop")}
          >
            Shop
          </button>
          <button
            className={activeTab === "cart" ? "active" : ""}
            onClick={() => {
              setActiveTab("cart");
              fetchCart();
            }}
          >
            Cart
            {cart && cart.items.length > 0 && (
              <span className="badge">{cart.items.length}</span>
            )}
          </button>
          <button
            className={activeTab === "admin" ? "active" : ""}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
        </nav>
      </header>

      <main>
        {activeTab === "shop" && <ProductList onAddToCart={handleAddToCart} />}
        {activeTab === "cart" && (
          <>
            <CartView
              cart={cart}
              onRemove={removeFromCart}
              onCheckoutComplete={handleCheckoutComplete}
              userId={USER_ID}
            />
            {lastOrder && (
              <div className="order-confirmation">
                <h3>Last Order Confirmed</h3>
                <p>Order ID: {lastOrder.id}</p>
                <p>Subtotal: {formatPrice(lastOrder.subtotal)}</p>
                {lastOrder.discountAmount > 0 && (
                  <p>Discount: -{formatPrice(lastOrder.discountAmount)}</p>
                )}
                <p className="order-total">
                  Total: {formatPrice(lastOrder.total)}
                </p>
              </div>
            )}
          </>
        )}
        {activeTab === "admin" && <AdminPanel />}
      </main>
    </div>
  );
}

export default App;
