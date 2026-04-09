import { useState } from "react";
import type { StoreStats } from "../types";
import { api } from "../api/client";

export function AdminPanel() {
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [discountResult, setDiscountResult] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const fetchStats = async () => {
    const data = await api.getStats();
    setStats(data);
  };

  const handleGenerateDiscount = async () => {
    const result = await api.generateDiscount();
    setDiscountResult(result.message);
    setGeneratedCode(result.code);
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <div className="admin-section">
        <h3>Generate Discount Code</h3>
        <button onClick={handleGenerateDiscount}>Generate</button>
        {discountResult && (
          <div className="result-box">
            <p>{discountResult}</p>
            {generatedCode && (
              <p className="generated-code">{generatedCode}</p>
            )}
          </div>
        )}
      </div>

      <div className="admin-section">
        <h3>Store Stats</h3>
        <button onClick={fetchStats}>Refresh Stats</button>
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{stats.totalOrders}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Items Purchased</span>
              <span className="stat-value">{stats.totalItemsPurchased}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Revenue</span>
              <span className="stat-value">
                {formatPrice(stats.totalRevenue)}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Discounts</span>
              <span className="stat-value">
                {formatPrice(stats.totalDiscountAmount)}
              </span>
            </div>
          </div>
        )}
        {stats && stats.discountCodes.length > 0 && (
          <div className="discount-list">
            <h4>Discount Codes</h4>
            <ul>
              {stats.discountCodes.map((dc) => (
                <li key={dc.code}>
                  <code>{dc.code}</code>{" "}
                  <span className={dc.used ? "used" : "available"}>
                    {dc.used ? "Used" : "Available"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
