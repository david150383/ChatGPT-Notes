The **Saga pattern** means:

> A way to manage a long-running business transaction across multiple services without using a single database transaction.

In simple terms:

- instead of one big “all-or-nothing” transaction (like in a monolith database),
- you break the process into multiple steps across services,
- and each step has a “compensating action” if something fails.

---

# Why Saga Pattern is Needed

In monolith systems:

- you can use a database transaction

Example:

```text id="a1b2c3"
BEGIN TRANSACTION
  deduct money
  reduce inventory
  create order
COMMIT
```

If anything fails → rollback everything.

---

# Problem in Microservices

In microservices:

- each service has its own database
- distributed transactions are hard and slow
- 2-phase commit is complex and not scalable

So we need a different approach → **Saga Pattern**

---

# Core Idea

A saga is:

> A sequence of local transactions, where each service does its own work, and publishes events. If something fails, compensating actions undo previous steps.

---

# Example: E-commerce Order

Services:

- Order Service
- Payment Service
- Inventory Service
- Shipping Service

---

# Step-by-step Saga Flow

## Step 1: Create Order

```text id="o1"
Order Service → create order (PENDING)
```

---

## Step 2: Payment

```text id="o2"
Payment Service → charge customer
```

---

## Step 3: Inventory

```text id="o3"
Inventory Service → reserve stock
```

---

## Step 4: Shipping

```text id="o4"
Shipping Service → schedule delivery
```

---

# What if Something Fails?

Suppose inventory fails:

```text id="f1"
Inventory Service → OUT OF STOCK ❌
```

Now we must undo previous steps.

---

# Compensating Actions (Rollback Logic)

Instead of database rollback, we do:

## Undo Payment

```text id="c1"
Payment Service → refund money
```

## Undo Order

```text id="c2"
Order Service → mark order CANCELLED
```

Now system is consistent again.

---

# This is the key idea:

> Instead of rollback transactions, we perform “compensating transactions.”

---

# Two Types of Saga Patterns

---

# 1. Choreography (Event-Driven)

No central controller.

Each service reacts to events.

Example flow:

```text id="ch1"
Order Created → Payment Service listens
Payment Success → Inventory Service listens
Inventory Success → Shipping Service listens
```

If failure:

- services publish “compensating events”

---

## Pros:

- simple
- loosely coupled
- scalable

## Cons:

- hard to track flow
- complex debugging
- no central control

---

# 2. Orchestration (Central Coordinator)

A central service controls the flow.

Example:

```text id="or1"
Saga Orchestrator:
  1. call Payment
  2. call Inventory
  3. call Shipping
```

If failure:

- orchestrator triggers compensation

---

## Pros:

- easy to understand
- better control
- easier debugging

## Cons:

- central dependency
- slightly more coupling

---

# Real Example Flow (Orchestration)

```text id="ex1"
1. Order created
2. Orchestrator calls Payment
3. Payment success
4. Orchestrator calls Inventory
5. Inventory fails
6. Orchestrator calls Payment refund
7. Order cancelled
```

---

# Key Concept: Eventual Consistency

Saga pattern does NOT guarantee instant consistency.

Instead:

> System becomes consistent over time.

Example:

- payment may be charged briefly
- later refunded if needed

This is called:

- eventual consistency

---

# Why Not Use Database Transactions?

Because in microservices:

- each service has separate DB
- network calls are involved
- latency is high
- services may fail independently

So traditional ACID transactions don’t work well.

---

# ACID vs Saga

## ACID (Monolith DB)

- Atomic
- Consistent
- Isolated
- Durable

Everything commits or fails together.

---

## Saga (Microservices)

- multiple small transactions
- each service commits independently
- compensation handles failure

---

# Real-World Analogy

Booking a trip:

1. book flight
2. book hotel
3. book cab

If hotel fails:

- cancel flight
- cancel cab

No single global transaction exists.

---

# Important Challenges

Saga pattern introduces complexity:

## 1. Partial Failure States

System may be halfway completed.

## 2. Compensation Complexity

Undo logic is not always easy.

Example:

- payment refund is easy
- but seat reservation rollback may not be

## 3. Data Consistency Delay

Users may see intermediate states.

## 4. Debugging Difficulty

Hard to trace full workflow.

---

# Tools Supporting Saga Patterns

Often implemented using:

- message brokers
- event streams

Example tools:

- Apache Kafka
- RabbitMQ

---

# Where Saga Pattern is Used

Common in:

- e-commerce systems
- booking systems (flights, hotels)
- banking systems
- ride-sharing apps

Examples:

- Amazon
- Uber

---

# Simple Summary

Saga pattern means:

> Breaking a distributed transaction into multiple steps, each handled by a service, and using compensating actions to undo work if something fails.

---

# One-Line Analogy

Instead of:

> “one big transaction with rollback”

Saga is:

> “many small transactions + smart undo steps when needed”

---

If you want, I can also draw a **step-by-step diagram of choreography vs orchestration saga** — that usually makes it very intuitive.
