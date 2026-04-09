# Design Decisions

## Decision: Prices stored as integers in cents

**Context:** Representing monetary values in JavaScript where floating-point arithmetic can produce incorrect results (e.g. `0.1 + 0.2 !== 0.3`).

**Options Considered:**
- Option A: Floating-point numbers representing dollars
- Option B: Integer cents (e.g. `$29.99` stored as `2999`)

**Choice:** Integer cents

**Why:** Eliminates floating-point precision bugs without adding a dependency. All arithmetic is simple integer math. The frontend handles formatting cents to dollars for display. A money library would be warranted for currency conversion or multi-currency support, but not for a single-currency store with basic calculations.

---

## Decision: In-memory store as a class with singleton export

**Context:** The application needs a data persistence layer. The assignment specifies in-memory storage is acceptable.

**Options Considered:**
- Option A: Plain JavaScript object exported as module state
- Option B: Class with a singleton export
- Option C: Dependency injection with an interface

**Choice:** Class with singleton export

**Why:** A plain object exposes raw state, making it easy to introduce inconsistencies through direct mutation. A class encapsulates state behind methods, keeps mutation logic centralized, and provides a `reset()` method for clean test isolation. Full dependency injection would add boilerplate (containers, providers) that isn't justified for a single storage implementation. If a real database were needed later, the class methods map naturally to repository functions.

---

## Decision: Separate service layer from route handlers

**Context:** Deciding where business logic should live. Route handlers could contain all logic, or logic could be extracted into a separate layer.

**Options Considered:**
- Option A: Business logic directly in route handlers
- Option B: Separate service layer called by routes
- Option C: Use-case / command pattern

**Choice:** Separate service layer

**Why:** Routes handle HTTP concerns (parsing bodies, setting status codes, calling `next(err)`). Services handle business rules (cart validation, discount calculations, order creation). This separation allows unit testing business logic by calling service functions directly, without mocking HTTP request/response objects. The same services could be reused by a different transport (CLI, WebSocket) without changes. A full use-case pattern would add unnecessary indirection for the current scope.

---

## Decision: Admin-triggered discount code generation

**Context:** The discount system needs to generate coupon codes for every nth order. The question is whether this happens automatically at checkout or through an explicit admin action.

**Options Considered:**
- Option A: Auto-generate discount codes during checkout when the nth order is placed
- Option B: Admin explicitly triggers generation via an API call

**Choice:** Admin triggers generation via API

**Why:** The task specifies an "admin API to generate a discount code." The admin endpoint checks whether the nth-order condition is met and only issues a code if eligible. This gives the admin visibility and control over when codes are issued, prevents codes from being generated silently, and keeps the checkout flow focused on placing orders. The server still enforces the nth-order rule, so codes cannot be generated arbitrarily.

---

## Decision: Manual validation over a schema library

**Context:** Request body validation for API endpoints. The API has a small number of endpoints with simple payloads.

**Options Considered:**
- Option A: Schema validation library (Zod, Joi)
- Option B: Manual validation in the service layer with custom error classes
- Option C: Express middleware validators (express-validator)

**Choice:** Manual validation with AppError

**Why:** The API has four endpoints with simple request bodies (a product ID with quantity, a user ID with optional discount code). Adding a schema library introduces a dependency and extra boilerplate for minimal benefit at this scale. Services validate inputs and throw `AppError` with appropriate HTTP status codes, caught by a centralized error-handling middleware. If the API grew to many endpoints with complex nested payloads, a schema library like Zod would justify its setup cost.
