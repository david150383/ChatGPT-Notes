Here are some **scenario-based interview questions and answers** around:

- monolith → microservices
- resilience
- APIs
- scalability
- reliability
- distributed systems

These are the kinds of questions commonly asked in:

- backend interviews
- system design rounds
- senior engineer interviews
- architect interviews

---

# 1. Monolith to Microservices Migration

## Question

Your company has a large monolith e-commerce application. Deployments are slow, and teams interfere with each other frequently. How would you approach migration to microservices?

---

## Good Answer

I would avoid a big-bang rewrite and use an incremental migration strategy.

First, I would:

- identify domain boundaries using business capabilities
- convert the monolith into a modular monolith if needed
- reduce tight coupling
- enforce APIs between modules

Then I would extract low-risk services first, such as:

- notifications
- search
- reporting

I would use the Strangler Fig Pattern:

- gradually route specific functionality to new services
- keep the rest in the monolith initially

I would also ensure:

- CI/CD pipelines exist
- centralized logging/monitoring is ready
- observability and tracing are implemented

I would avoid:

- shared databases
- synchronous dependency chains
- extracting highly coupled domains first

---

# 2. Shared Database Problem

## Question

A team created multiple microservices, but all services directly access the same database. What problems can occur?

---

## Good Answer

This creates tight coupling and a distributed monolith.

Problems include:

- schema changes breaking multiple services
- unclear data ownership
- deployment coordination issues
- inability to evolve services independently
- cascading failures through shared DB bottlenecks

Each service should ideally own its data and expose APIs/events instead of direct DB access.

---

# 3. Resilience Scenario

## Question

A downstream Payment Service becomes slow. Suddenly the entire system becomes unstable. Why?

---

## Good Answer

This is likely a cascading failure.

Possible sequence:

- Order Service waits for Payment Service
- request threads become blocked
- thread pool exhaustion occurs
- retries increase traffic further
- upstream services slow down

To improve resilience:

- add timeouts
- use circuit breakers
- limit retries
- implement bulkhead isolation
- degrade gracefully if possible

Tools like Resilience4j can help implement this.

---

# 4. API Versioning

## Question

You need to change a public API response format used by mobile applications. How would you handle it?

---

## Good Answer

I would avoid breaking existing consumers abruptly.

Options:

- maintain backward compatibility if possible
- introduce a new API version like `/v2/users`
- deprecate old version gradually
- communicate migration timelines clearly

For mobile apps especially, older clients may remain active for months, so compatibility is critical.

---

# 5. Saga Pattern

## Question

How would you handle transactions across Order, Payment, and Inventory services?

---

## Good Answer

I would use the Saga Pattern because distributed ACID transactions across services are difficult and expensive.

Example flow:

1. create order
2. charge payment
3. reserve inventory

If inventory reservation fails:

- trigger compensating transaction
- refund payment
- cancel order

This provides eventual consistency while keeping services independent.

---

# 6. Tight Coupling Scenario

## Question

A small change in the Payment module frequently breaks Orders and Notifications. What architectural issue does this indicate?

---

## Good Answer

This indicates tight coupling and weak modularity.

Possible causes:

- direct database access across modules
- shared internal classes
- no API boundaries
- duplicated business logic

I would:

- define clear interfaces/APIs
- reduce shared dependencies
- introduce event-driven communication where appropriate
- isolate domain responsibilities

---

# 7. Incident Response

## Question

Production is down at 2 AM. Users cannot complete payments. What steps would you take?

---

## Good Answer

I would follow an incident response process:

1. detect scope/severity
2. check dashboards/logs/traces
3. identify recent deployments
4. mitigate quickly:
   - rollback deployment
   - scale service
   - disable problematic feature

5. communicate status
6. perform RCA/postmortem afterward

I would prioritize restoring service before deep root-cause analysis.

---

# 8. Event-Driven vs REST

## Question

When would you choose asynchronous messaging over synchronous REST calls?

---

## Good Answer

I would prefer async messaging when:

- loose coupling is important
- eventual consistency is acceptable
- workflows are long-running
- resilience/scalability is important

Examples:

- notifications
- analytics
- audit logging

I would use synchronous APIs when:

- immediate response required
- request-response interaction needed
- strong consistency expectations exist

Usually mature systems use both approaches.

---

# 9. Reliability Isolation

## Question

What does reliability isolation mean in microservices?

---

## Good Answer

It means failures should remain localized instead of affecting the entire platform.

Example:

- recommendation service fails
- checkout and payments should still work

Techniques:

- process isolation
- bulkheads
- circuit breakers
- independent scaling
- graceful degradation

Goal:

- reduce blast radius.

---

# 10. Observability

## Question

Why is observability more important in microservices than monoliths?

---

## Good Answer

Microservices increase operational complexity because requests flow across multiple services.

Without observability:

- debugging becomes difficult
- tracing failures becomes hard

We need:

- centralized logging
- metrics
- distributed tracing
- correlation IDs

Tools:

- Prometheus
- Grafana
- Jaeger

---

# 11. Scaling Scenario

## Question

Search traffic spikes heavily during a sale event, but payments remain stable. How would microservices help?

---

## Good Answer

Microservices allow independent scaling.

We can:

- scale Search Service separately
- allocate more CPU/memory only where needed

This improves:

- resource efficiency
- cost optimization
- reliability

In a monolith, we may need to scale the entire application unnecessarily.

---

# 12. API Governance

## Question

Different teams return completely different API formats and error structures. What problem does this create?

---

## Good Answer

This indicates lack of API governance.

Problems:

- integration inconsistency
- frontend complexity
- onboarding difficulty
- maintenance overhead

I would standardize:

- naming conventions
- error formats
- authentication
- versioning
- documentation

Using standards like:

- OpenAPI

---

# 13. Token Propagation

## Question

Why is token propagation important in microservices?

---

## Good Answer

Because downstream services need user identity and authorization context.

Without token propagation:

- services lose security context
- authorization becomes inconsistent
- auditing becomes difficult

Typically JWT tokens are forwarded across services securely.

---

# 14. Distributed Monolith

## Question

What is a distributed monolith?

---

## Good Answer

A distributed monolith is:

- technically split into services
- but still tightly coupled operationally

Symptoms:

- shared database
- synchronous dependency chains
- coordinated deployments
- cascading failures

It combines:

- monolith coupling
  PLUS
- distributed systems complexity

Worst of both worlds.

---

# 15. Graceful Degradation

## Question

What is graceful degradation?

---

## Good Answer

It means:

- non-critical features can fail
- while critical functionality continues working

Example:

- recommendations unavailable
- but checkout still works

This improves resilience and user experience during failures.

---

# 16. CAP Theorem Scenario

## Question

A distributed system experiences a network partition. What tradeoff must be made?

---

## Good Answer

According to CAP theorem:
during partition tolerance, system must choose between:

- consistency
  OR
- availability

Different systems prioritize differently depending on business needs.

---

# 17. Database Per Service

## Question

Why is “database per service” recommended?

---

## Good Answer

It improves:

- service autonomy
- loose coupling
- independent evolution
- deployment flexibility

Shared databases create hidden coupling and coordination problems.

Communication should happen via:

- APIs
- events

not direct table access.

---

# 18. Circuit Breaker

## Question

What problem does a circuit breaker solve?

---

## Good Answer

It prevents cascading failures.

If a downstream service repeatedly fails:

- circuit opens
- requests fail fast temporarily

This protects:

- thread pools
- system resources
- upstream services

---

# 19. Eventual Consistency

## Question

What is eventual consistency?

---

## Good Answer

It means:

- data may not become instantly consistent across services
- but will converge over time

Common in:

- event-driven microservices
- saga-based workflows

Tradeoff:

- better scalability and decoupling
- less immediate consistency

---

# 20. Most Important Microservice Principle

## Question

What is the biggest mistake companies make when adopting microservices?

---

## Good Answer

Adopting microservices before organizational and engineering maturity.

Common mistakes:

- poor modularity
- no observability
- shared databases
- no CI/CD
- excessive synchronous communication
- lack of clear domain boundaries

Microservices amplify both strengths and weaknesses.
