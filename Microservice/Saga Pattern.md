The **Saga Pattern** is a way to manage **distributed transactions** in a microservices architecture without using a single global database transaction.

In a monolith, you might use one ACID transaction:

```sql
BEGIN TRANSACTION
UPDATE account
UPDATE inventory
CREATE order
COMMIT
```

But in microservices, each service usually has **its own database**, so a single transaction across services is difficult and tightly coupled.

The Saga Pattern solves this by breaking a transaction into a sequence of **local transactions** coordinated across services.

---

# What Problem Does Saga Solve?

Imagine an e-commerce flow:

1. Order Service creates order
2. Payment Service charges customer
3. Inventory Service reserves stock
4. Shipping Service schedules delivery

What if payment succeeds but inventory fails?

Without Saga:

- system becomes inconsistent

With Saga:

- previously completed steps are **compensated (rolled back logically)**

Example:

- refund payment
- cancel order

---

# Core Idea

A Saga consists of:

- **Sequence of local transactions**
- Each service updates its own DB
- Services communicate through:
  - events
  - messages
  - commands

- If one step fails:
  - execute **compensating transactions**

---

# Example Flow

## Successful Saga

```text
Create Order
   ↓
Reserve Inventory
   ↓
Process Payment
   ↓
Ship Order
```

---

## Failed Saga

```text
Create Order ✓
Reserve Inventory ✓
Process Payment ✗
```

Compensations:

```text
Release Inventory
Cancel Order
```

---

# Types of Saga Pattern

There are **2 main types**:

1. Choreography-based Saga
2. Orchestration-based Saga

---

# 1. Choreography Saga

In choreography, services communicate using **events**.

There is **no central coordinator**.

Each service:

- listens to events
- performs action
- publishes next event

---

## Flow Example

```text
Order Service
   ↓ publishes
OrderCreated

Inventory Service
   ↓ publishes
InventoryReserved

Payment Service
   ↓ publishes
PaymentProcessed
```

---

## Failure Example

```text
PaymentFailed
   ↓
Inventory Service releases stock
   ↓
Order Service cancels order
```

---

## Architecture

```text
Service → Event Bus → Service
```

Typically uses:

- Kafka
- RabbitMQ
- Pulsar

---

## Advantages

- Loosely coupled
- Easy for small workflows
- No single point of failure
- Highly scalable

---

## Disadvantages

- Hard to track flow
- Complex debugging
- Event chains become messy
- Circular dependencies possible
- Difficult monitoring

---

## Best For

- Small/simple workflows
- Event-driven systems
- High scalability systems

---

# 2. Orchestration Saga

In orchestration, a **central orchestrator** controls the workflow.

Services do not decide next step.

The orchestrator:

- sends commands
- waits for replies
- handles rollback logic

---

## Flow Example

```text
Orchestrator
   ↓
Create Order Command

Orchestrator
   ↓
Reserve Inventory Command

Orchestrator
   ↓
Process Payment Command
```

---

## Failure Example

If payment fails:

```text
Orchestrator
   ↓
Release Inventory Command
   ↓
Cancel Order Command
```

---

## Architecture

```text
Orchestrator
   ↓
Service A
Service B
Service C
```

---

## Advantages

- Centralized control
- Easier debugging
- Easier monitoring
- Workflow visible
- Better for complex business logic

---

## Disadvantages

- Orchestrator can become bottleneck
- Slightly tighter coupling
- Extra component to maintain

---

## Best For

- Complex workflows
- Enterprise systems
- Banking/payments
- Long-running business processes

---

# Choreography vs Orchestration

| Feature             | Choreography           | Orchestration      |
| ------------------- | ---------------------- | ------------------ |
| Control             | Distributed            | Centralized        |
| Coordinator         | No                     | Yes                |
| Communication       | Events                 | Commands + replies |
| Coupling            | Loose                  | Moderate           |
| Debugging           | Hard                   | Easier             |
| Scalability         | High                   | Moderate           |
| Complexity Handling | Poor for large systems | Better             |
| Visibility          | Low                    | High               |

---

# Compensating Transactions

A key concept in Saga.

Instead of DB rollback:

```text
Debit Account
```

you do:

```text
Credit Account
```

Examples:

| Action            | Compensation      |
| ----------------- | ----------------- |
| Reserve inventory | Release inventory |
| Charge card       | Refund payment    |
| Create booking    | Cancel booking    |

---

# Important Characteristics

## 1. Eventual Consistency

Saga does NOT provide immediate consistency.

Systems become consistent **eventually**.

---

## 2. Idempotency

Operations should be idempotent.

Meaning:

```text
same request repeated → same result
```

Needed because:

- messages may duplicate
- retries happen

---

## 3. Retry Handling

Temporary failures should retry automatically.

---

## 4. Timeout Handling

Some services may not respond.

Saga should:

- timeout
- compensate
- mark failed

---

# Common Technologies

## Choreography

- Apache Kafka
- RabbitMQ
- AWS SNS/SQS

---

## Orchestration

- Camunda
- Temporal
- Netflix Conductor
- Orkes Conductor
- Axon Framework

---

# Real-World Example

## Food Delivery App

### Services

- Order Service
- Restaurant Service
- Payment Service
- Delivery Service

### Saga Flow

```text
Create Order
→ Accept Restaurant
→ Process Payment
→ Assign Delivery Partner
```

If delivery assignment fails:

```text
Refund Payment
Cancel Order
Notify Customer
```

---

# When NOT to Use Saga

Avoid Saga when:

- simple CRUD app
- strong consistency absolutely required
- workflow is tiny and local
- distributed transactions unnecessary

Sometimes a monolith or direct DB transaction is simpler.

---

# Related Concepts

Saga is often used with:

- Event-Driven Architecture
- CQRS
- Outbox Pattern
- Event Sourcing
- Distributed Messaging

---

# Simple Mental Model

Think of Saga as:

> “A distributed transaction with intelligent undo steps.”

Instead of:

- one giant rollback

you have:

- multiple local commits
- plus compensating actions if failure occurs

---

# Interview-Friendly Definition

> Saga Pattern is a microservices design pattern used to manage distributed transactions through a sequence of local transactions and compensating actions, ensuring eventual consistency across services.
