import { useEffect, useState } from "react";
import type { Product } from "../types";
import { api } from "../api/client";

interface Props {
  onAddToCart: (productId: string, quantity: number) => void;
}

export function ProductList({ onAddToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div>
      <h2>Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="card">
            <h3>{product.name}</h3>
            <p className="price">{formatPrice(product.price)}</p>
            <button onClick={() => onAddToCart(product.id, 1)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
