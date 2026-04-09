# Uniblox Ecommerce Store

An ecommerce store with cart, checkout, discount system, and admin panel.

## Tech Stack

- **Backend:** TypeScript, Express, Node.js
- **Frontend:** React, Vite
- **Testing:** Jest
- **Package Manager:** pnpm (monorepo)

## Setup

```bash
pnpm install
```

## Running

Start the backend (port 3001):

```bash
pnpm dev
```

Start the frontend (port 5173):

```bash
pnpm dev:frontend
```

## Testing

```bash
pnpm test
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/cart/:userId` | Get user's cart |
| POST | `/api/cart/:userId/items` | Add item to cart |
| DELETE | `/api/cart/:userId/items/:productId` | Remove item from cart |
| POST | `/api/checkout` | Place an order |
| POST | `/api/admin/generate-discount` | Generate discount code |
| GET | `/api/admin/stats` | Store statistics |

### Checkout

```bash
curl -X POST http://localhost:3001/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-1", "discountCode": "DISCOUNT-ABC123"}'
```

## Configuration

Set via environment variables in `packages/backend/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NTH_ORDER` | 5 | Every nth order earns a discount |
| `DISCOUNT_PERCENT` | 10 | Discount percentage |

## Project Structure

```
packages/
  backend/       Express API with in-memory store
  frontend/      React SPA
```
