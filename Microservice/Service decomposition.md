**Service decomposition** is the architectural process of breaking down a large, monolithic application (or a complex domain) into a collection of smaller, loosely coupled, independently deployable microservices.

The goal is to draw clean boundaries around functionality so individual teams can build, test, scale, and release features without blocking each other or destabilizing the wider system.

---

### Core Strategies for Decomposing Services

Decomposition is not about splitting code by technical layers (e.g., UI vs. API vs. Database); it is about splitting by **business responsibility**.

#### 1. Decompose by Subdomain (Domain-Driven Design / DDD)

This is the most widely recommended approach. You analyze the business domain and identify its distinct subdomains:

* **Core Domain:** The primary competitive advantage (e.g., a proprietary recommendation engine or algorithmic pricing).
* **Supporting Domain:** Business capabilities specific to the model but not core differentiators (e.g., inventory management or order fulfillment).
* **Generic Domain:** Standard capabilities required by any business (e.g., authentication, billing, notification dispatch).

Each identifiable **Bounded Context**—where a business term has a single, unambiguous meaning—becomes a candidate for a dedicated microservice.

#### 2. Decompose by Business Capability

You map services directly to what an organization does to deliver value:

* **E-Commerce Example:** `Product Catalog Service`, `Checkout Service`, `Inventory Service`, `Shipping Service`.
* **Benefit:** Aligning services with business units naturally supports **Conway’s Law**—cross-functional teams (product owner, frontend, backend, QA) can take full ownership of a single business capability end-to-end.

#### 3. Decompose by Volatility or Change Frequency

Parts of a codebase that change every day should not be tangled with parts that change twice a year.

* Fast-changing features (e.g., marketing promotions, dynamic pricing experiments) are split from slow-changing, high-stability modules (e.g., user identity, ledger auditing).

#### 4. Decompose by Scalability and Resource Requirements

Modules with drastically different hardware or execution profiles are separated:

* High-throughput, memory-bound tasks (e.g., image/video transcoding, real-time analytics aggregation) are split from standard I/O-bound CRUD endpoints.

---

### Migration Strategies: How Teams Actually Decompose

Rewriting a monolith from scratch ("Big Bang" rewrite) usually fails. Instead, teams use evolutionary patterns:

```text
               ┌───────────────────────┐
  Incoming ───►│ API Gateway / Proxy   │
  Requests     └───────┬───────┬───────┘
                       │       │
       Legacy Traffic  │       │ New / Carved-out Traffic
                       ▼       ▼
         ┌──────────────────┐  ┌───────────────────────┐
         │ Monolithic App   │  │ Extracted Service     │
         │ (Shrinking Core) │  │ (e.g., Notifications) │
         └──────────────────┘  └───────────────────────┘

```

* **Strangler Fig Pattern:** Incrementally replace parts of the monolith by placing an API Gateway in front of it. New features or extracted modules are routed to new microservices, while existing routes still hit the monolith. Over time, the monolith shrinks until it can be retired.
* **Branch by Abstraction:** Inside the monolithic codebase, introduce an internal interface around the component to be extracted. Migrate call sites to the interface, switch the implementation to an external network call, and finally remove the old internal code.
* **Database-First Separation:** True decomposition requires splitting data storage (**Database-per-Service**). Shared database tables are untangled first through foreign key removal, asynchronous replication, or views before separating the application code.

---

### Common Pitfalls to Avoid

* **Distributed Monolith:** Splitting code into multiple services while keeping a single, shared relational database. If any database migration risks breaking multiple services simultaneously, you have inherited the network complexity of microservices without gaining deployment independence.
* **Over-Decomposition (Nano-services):** Breaking services down so granularly that every basic user operation requires dozens of synchronous HTTP/gRPC hops across the network, introducing severe latency, cascading failures, and distributed tracing overhead.
* **Chatty Synchronous Communication:** Designing boundaries where Service A must synchronously query Service B and Service C to respond to a request. Healthy decomposition maximizes local autonomy using event-driven communication (e.g., domain events published via message brokers).