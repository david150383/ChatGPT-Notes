Here is a comprehensive reference architecture note and workflow diagram covering the entire lifecycle, state transitions, and edge cases we discussed.

---

# Architecture Blueprint: High-Scale E-Commerce Order Lifecycle

## 1. Core Architectural Tenets

1. **Never write unconfirmed orders to SQL/Warehouse DBs:** Disk I/O, row locking, and distributed compensation transactions are too slow and brittle.
2. **Two-Phase Inventory Pattern:**
* **Phase 1 (Sync Gate):** Fast in-memory atomic deduction with a Time-To-Live lease in Redis ($< 15\text{ ms}$).
* **Phase 2 (Async Settle):** Background permanent persistence to SQL / Warehouse systems only after money is secured.


3. **Idempotent Compensations:** Every rollback action must be repeatable without artificially altering inventory counts.

---

## 2. Complete End-to-End Workflow Diagram

```
                 [ User clicks "Place Order" ]
                               │
                               ▼
                        [ API Gateway ]
                     (Auth / Rate Limiting)
                               │
                               ▼
               [ Order Service (Saga Orchestrator) ]
                               │
             ┌─────────────────┴─────────────────┐
             │ [STEP 1: In-Memory Inventory Hold]│
             │   (Sync gRPC/REST -> Redis)       │
             └─────────────────┬─────────────────┘
                               │
               ┌───────────────┴───────────────┐
      [Stock Not Available]           [Stock Available]
               │                               │
               ▼                               ▼
       Return 409 Conflict            Deduct stock in Redis
     "Item Out of Stock"              Create hold key (TTL: 15m)
                                               │
                                               ▼
                             ┌───────────────────────────────────┐
                             │ [STEP 2: Payment Branching]       │
                             └─────────────────┬─────────────────┘
                                               │
                     ┌─────────────────────────┴─────────────────────────┐
                     ▼                                                   ▼
            [ Cash on Delivery ]                                  [ Card Payment ]
                     │                                                   │
                     │                                         Attempt Charge (Stripe/Bank)
                     │                                                   │
                     │                                   ┌───────────────┴───────────────┐
                     │                                   ▼                               ▼
                     │                           [Charge Succeeded]              [Charge Failed]
                     │                                   │                               │
                     │                                   │                       [Saga Rollback]
                     │                                   │                               │
                     │                                   │                    1. INCRBY stock in Redis
                     │                                   │                    2. DEL hold key
                     │                                   │                    3. Order Status -> FAILED
                     │                                   │                    4. Notify user to retry
                     │                                   │
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ [STEP 3: Order Confirmed (200 / 201)]   │
                  │   Publish Domain Event: OrderConfirmed  │
                  └────────────────────┬────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
[ Notification Service ]      [ Inventory Worker ]         [ Fulfillment Service ]
Send SMS / Email receipt     - DEL Redis hold key          Route to regional warehouse
                             - SQL: Permanent stock ded.   Queue physical pick & pack

```

---

## 3. Redis Data Model & The Expiration Trap

Never rely solely on Redis key deletion for stock recovery, because passive deletion does not put items back into available stock.

### The Key Schema

* **Available Stock (No TTL):** `product:{sku}:stock` (e.g., integer `8`)
* **Active Hold (TTL: 900s):** `hold:{orderId}:{sku}` (e.g., integer `2`)

### The 3 Resolution Paths

| Scenario | Trigger | Action on `product:{sku}:stock` | Action on `hold:{orderId}:{sku}` |
| --- | --- | --- | --- |
| **A. Payment Success** | Gateway returns `200` | No change (already decremented) | Delete key (`DEL`) + push SQL commit job |
| **B. Immediate Decline** | Gateway returns `402` | `INCRBY` by held quantity | Delete key (`DEL`) immediately |
| **C. User Abandons** | 15 min TTL elapses | `INCRBY` via **SQS Delay Queue** or **Sweeper** | Automatically expired / deleted |

---

## 4. Frontend UX & Protocol Contracts

### Synchronous Gateway vs. Amazon Async Model

| Payment Mode | HTTP Code | UI Loading State | Final Transition |
| --- | --- | --- | --- |
| **Standard Card (Stripe)** | `200 OK` | Modal spinner: *"Authorizing payment with your bank..."* | If success $\rightarrow$ "Order Placed!"<br>

<br>If fail $\rightarrow$ Display decline banner on checkout page. |
| **Amazon High-Scale Card** | `202 Accepted` | Brief button spinner ($< 300\text{ ms}$) | Immediately navigate to "Order Received" screen. If payment drops 2 min later, send email: *"Update payment method"*. |
| **Cash on Delivery (COD)** | `201 Created` | Brief button spinner ($< 200\text{ ms}$) | Immediately route to "Order Confirmed! Pay on delivery" screen. |

---

## 5. Architectural Pocket Guide / Cheat Sheet

* **Order Service:** Runs the Saga orchestrator. Holds the state machine (`PENDING` $\rightarrow$ `RESERVED` $\rightarrow$ `PAID` $\rightarrow$ `FULFILLED`).
* **Inventory Service:** Two distinct layers—Redis for instant gating/overselling prevention, and relational SQL for warehouse ERP audits.
* **Payment Service:** Interfaces with token vaults. Decoupled from cart/catalog concerns.
* **Compensating Action Guarantee:** Rollbacks must be **idempotent**. If network retries trigger a release call twice, it must verify the hold state and avoid inflating stock twice.
* **Safety Backstop:** Always back up in-memory reservations with a delayed queue message (e.g., AWS SQS 15-minute delay) to safely reclaim abandoned stock.