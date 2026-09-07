“Enforce APIs between modules” means:

> Modules should communicate only through clearly defined interfaces/contracts, not by directly touching each other’s internal code or database tables.

This creates boundaries and reduces coupling.

---

# The Core Idea

A module should expose:

- what others are allowed to use

and hide:

- internal implementation details

Like a public API.

---

# Bad Example (No API Boundary)

Suppose you have modules:

- Orders
- Payments

In weak modularity:

```text id="szzy0k"
Order module:
- directly updates payment tables
- calls internal payment methods
- reads payment private fields
```

Example:

```java id="3lr4ci"
paymentRepository.updateStatus(orderId, "PAID");
```

Now Orders knows:

- payment schema
- payment internals
- payment implementation details

Problems:

- payment changes break orders
- impossible to evolve independently
- hidden dependencies everywhere

---

# Better Example (API Boundary)

Instead:

```java id="mofz13"
paymentService.processPayment(orderId, amount);
```

Orders only knows:

- public contract

NOT:

- database structure
- internal logic
- third-party payment provider details

Payment module handles internals itself.

---

# Think of It Like a Restaurant

Customer:

- places order via menu

Customer does NOT:

- enter kitchen
- use stove
- touch ingredients

The menu is the API.

Kitchen internals are hidden.

Modules should work similarly.

---

# Why This Matters

Without enforced APIs:

- modules become tightly coupled
- changing internals becomes dangerous
- refactoring is painful
- extraction to microservices becomes hard

With APIs:

- modules become replaceable
- internal changes stay isolated
- testing improves
- migration becomes easier

---

# Example: User Module

## Bad

Order module directly queries user DB tables:

```sql id="ng6l6l"
SELECT * FROM users WHERE id=10;
```

Now Order module depends on:

- schema
- table names
- column structure

If User module changes schema:

- Order breaks.

---

# Better

Order module calls:

```java id="6ff3gd"
userService.getUserProfile(userId)
```

Now:

- User module owns its data
- schema can evolve internally
- external contract remains stable

---

# Inside a Monolith

This concept applies even BEFORE microservices.

You can enforce APIs within one codebase.

Example structure:

```text id="fp6f02"
modules/
 ├── users/
 │    ├── api/
 │    ├── internal/
 │
 ├── payments/
 │    ├── api/
 │    ├── internal/
```

Rules:

- other modules access only `/api`
- `/internal` is private

This creates clean boundaries.

---

# Common Ways to Enforce APIs

## 1. Service Interfaces

Example:

```java id="uic64j"
interface PaymentService {
   PaymentResult charge(...);
}
```

Other modules use interface only.

---

# 2. Events

Instead of direct calls:

```text id="6l14xv"
OrderPlaced event
```

Other modules react independently.

This reduces coupling even more.

---

# 3. Access Restrictions

Languages/frameworks can restrict:

- package access
- internal classes
- private methods

Example:

- Java package-private
- C# internal
- TypeScript exports

---

# 4. API Gateway Pattern (Microservices)

Later in microservices:

- services communicate through HTTP/gRPC APIs

But concept starts earlier inside monolith.

---

# Example of Tight Coupling vs API Boundary

---

## Tight Coupling

```text id="4nl4fr"
Order Module
   ↓
Payment DB
   ↓
Inventory DB
   ↓
Notification internals
```

Everything connected directly.

---

## API Boundary

```text id="9w4m4v"
Order Module
   ↓
Payment API

OrderPlaced Event
   ↓
Notification Module
```

Cleaner and safer.

---

# Real-World Example

Imagine:

> Payment provider changes from Stripe to Razorpay.

Without APIs:

- many modules require changes

With proper boundaries:

- only Payment module changes internally

Everything else still calls:

```text id="ggg0y6"
processPayment()
```

Huge maintenance advantage.

---

# Why This Is Important Before Microservices

If modules already communicate through APIs:

- extracting service becomes easier

Because:

- communication contract already exists

You can replace:

```text id="vdbij3"
local method call
```

with:

```text id="vlwsyq"
HTTP/gRPC call
```

without rewriting entire system logic.

---

# Common Anti-Patterns

## Shared Database Access

Worst offender:

```text id="u5x4jd"
all modules directly reading/writing all tables
```

No ownership.

No boundaries.

---

# Shared Utility Chaos

Example:

```text id="hnfq7q"
CommonUtils.java
```

used by entire system.

Eventually:

- impossible dependencies
- hidden coupling

---

# “Just Call Internal Class”

Example:

```java id="ey4hks"
PaymentInternalProcessor.doStuff()
```

outside payment module.

Now internals leak everywhere.

---

# Strong Modularity Rule

A module should expose:

- WHAT it does

not:

- HOW it does it

---

# Simple Analogy

## No API Enforcement

Everyone enters everyone’s room:

- moves furniture
- changes wiring
- breaks things

## API Enforcement

Interaction happens only through doors/interfaces.

Rooms stay independent.

---

# Final Takeaway

“Enforce APIs between modules” means:

- modules communicate through defined contracts
- internals stay hidden
- direct database/internal access is restricted
- dependencies become controlled
- modules become independently maintainable

This is one of the most important steps before moving from:

- messy monolith
  to
- modular monolith
  to
- microservices.
