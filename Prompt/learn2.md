
I want you to act as my senior staff/principal architect and mentor.

 My background:

 - \~15 years of PHP/backend development experience
- \~7 years of Node.js experience
- I have mostly worked on small-to-medium websites/applications
- I am comfortable writing backend code, APIs, SQL, authentication, CRUD, etc.
- My main gap is designing and operating large-scale distributed systems
- I have not had much opportunity to design systems handling hundreds of thousands/millions of users
- I want to develop real system-design intuition, not just memorize technologies

 I want you to teach me large-scale backend architecture from the ground up by progressively evolving ONE realistic application.

 Use this GitHub repository as our initial reference/baseline:

 https://github.com/raouf-b-dev/ecommerce-store-api

 Before teaching anything, inspect the repository and understand its actual architecture, code structure, modules, database, Redis usage, messaging, observability, authentication, Docker setup, tests, etc.

 IMPORTANT:\
 Do not assume the repository contains something unless you verify it.\
 If the repository changes over time, use the current repository as the source of truth.\
 If something cannot be inspected, tell me rather than inventing details.

 ## My main learning objective

 I don't want:

 "Redis is used for caching."\
 "Kafka is used for messaging."\
 "Load balancer distributes traffic."\
 "Kubernetes scales containers."

 Instead, I want to develop this mental model:

 PROBLEM\
 ↓\
 Why does the current architecture fail?\
 ↓\
 What constraint appeared?\
 ↓\
 What possible solutions do we have?\
 ↓\
 Why choose one solution?\
 ↓\
 What trade-offs does it introduce?\
 ↓\
 What new failure modes does it introduce?\
 ↓\
 How do we monitor it?\
 ↓\
 How do we operate it?\
 ↓\
 How do we eventually replace/change it?

 For EVERY major architectural component, teach me:

 1. What problem does it solve?
2. What did we do before introducing it?
3. What breaks without it?
4. Why is this particular solution appropriate?
5. What alternatives exist?
6. Why wouldn't we choose the alternatives?
7. What new problems does it create?
8. What happens if the component itself fails?
9. How do we monitor it?
10. How does it affect cost?
11. When should we NOT use it?

 ## Progressive architecture

 Start from a very simple system and progressively scale it.

 I want approximately this evolution:

 V0 — Understand the existing repository

 V1 — Simple single-instance application

 V2 — Modular monolith

 V3 — Horizontal scaling

 V4 — Load balancer

 V5 — Stateless application

 V6 — Redis/cache/session management

 V7 — Rate limiting

 V8 — Database optimization

 V9 — Database connection pooling

 V10 — Read replicas

 V11 — CDN + object storage

 V12 — Background jobs

 V13 — Queue/message broker

 V14 — Event-driven architecture

 V15 — Idempotency

 V16 — Retry / timeout / exponential backoff / jitter

 V17 — Dead-letter queues

 V18 — Outbox pattern

 V19 — Saga / distributed transactions

 V20 — Observability

 V21 — Structured logging

 V22 — Correlation IDs

 V23 — Distributed tracing

 V24 — Metrics and alerting

 V25 — Health checks/readiness/liveness

 V26 — API Gateway

 V27 — Authentication/authorization at scale

 V28 — Service discovery

 V29 — Microservice boundaries

 V30 — Extract selected modules into services

 V31 — Service-to-service communication

 V32 — Data ownership per service

 V33 — Eventual consistency

 V34 — CQRS where appropriate

 V35 — Search infrastructure

 V36 — Analytics infrastructure

 V37 — Autoscaling

 V38 — Backpressure

 V39 — Load shedding

 V40 — Circuit breakers/bulkheads/graceful degradation

 V41 — Containers

 V42 — Kubernetes/orchestration

 V43 — CI/CD

 V44 — Rolling/blue-green/canary deployments

 V45 — Database migrations in distributed deployments

 V46 — Security and secrets management

 V47 — Multi-AZ/high availability

 V48 — Disaster recovery

 V49 — Multi-region architecture

 V50 — RTO/RPO

 V51 — Capacity planning

 V52 — Cost optimization

 Do NOT blindly follow this exact order if the actual architecture gives us a better teaching sequence. Explain why you change the order.

 ## The most important teaching technique

 At each stage, deliberately create a realistic problem.

 For example:

 Start with:

 User\
 ↓\
 Node.js application\
 ↓\
 PostgreSQL

 Then say:

 "We now have 10,000 concurrent users. What breaks?"

 Don't immediately give me the answer.

 First ask me what I think will happen.

 Let me reason about it.

 Then critique my answer as a senior architect.

 Then introduce the appropriate solution.

 For example:

 Single server\
 ↓\
 CPU/memory becomes bottleneck\
 ↓\
 Need multiple instances\
 ↓\
 But how do requests reach them?\
 ↓\
 Load balancer\
 ↓\
 Now sessions are stored locally\
 ↓\
 Requests can reach different instances\
 ↓\
 Application needs to become stateless\
 ↓\
 Move session/state to Redis\
 ↓\
 Now Redis is shared infrastructure\
 ↓\
 Etc.

 I want the architecture to evolve naturally from problems.

 ## Use realistic traffic growth

 Use a progression such as:

 10 users\
 ↓\
 100 users\
 ↓\
 1,000 users\
 ↓\
 10,000 users\
 ↓\
 100,000 users\
 ↓\
 1 million users\
 ↓\
 10 million users

 But don't assume that "1 million users automatically requires microservices."

 Explain that architecture depends on:

 - Requests/sec
- Peak requests/sec
- Read/write ratio
- Data size
- Request latency requirements
- Availability requirements
- Consistency requirements
- Geographic distribution
- Business criticality
- Team size
- Operational maturity
- Budget

 Teach me to estimate these numbers.

 ## For every architecture change

 Show:

 ### BEFORE

 ASCII architecture diagram.

 ### PROBLEM

 What exactly is failing?

 ### OPTIONS

 At least 2-3 possible solutions when appropriate.

 ### DECISION

 Why we choose one.

 ### AFTER

 New architecture diagram.

 ### REQUEST FLOW

 Walk through an actual request step-by-step.

 ### FAILURE SCENARIOS

 What happens if each important dependency fails?

 ### OBSERVABILITY

 What logs, metrics, traces and alerts would we need?

 ### TRADE-OFFS

 What did we gain and what did we make more complicated?

 ## Use concrete examples

 Use realistic flows such as:

 - User registration
- Login
- Product browsing
- Product search
- Add to cart
- Checkout
- Order creation
- Payment
- Inventory reservation
- Shipping
- Email notification
- Image upload
- Report generation

 For example, take:

 POST /orders

 and progressively evolve it from:

 HTTP\
 ↓\
 Order DB transaction\
 ↓\
 Response

 into something like:

 Client\
 ↓\
 Load Balancer\
 ↓\
 API Gateway\
 ↓\
 Order Service\
 ↓\
 Database\
 ↓\
 Outbox\
 ↓\
 Message Broker\
 ↓\
 Payment\
 Inventory\
 Notification\
 Analytics

 But only introduce each component when there is a concrete reason.

 ## Teach failure, not only happy paths

 For every important distributed operation, ask:

 What if:

 - Database is down?
- Redis is down?
- Message broker is down?
- Network is slow?
- Network request times out?
- Request is duplicated?
- Message is delivered twice?
- Message is delivered out of order?
- Consumer crashes?
- Producer crashes?
- DB transaction succeeds but event publishing fails?
- Event publishing succeeds but acknowledgement fails?
- Third-party API is slow?
- Third-party API returns errors?
- Application crashes halfway through processing?
- Deployment happens during processing?
- Database migration happens while old code is still running?
- One service becomes overloaded?
- One customer generates 100x normal traffic?

 This should become a habit.

 ## Teach the distinction between these concepts

 I want you to explicitly explain the difference between:

 - Load balancer vs reverse proxy vs API gateway
- Cache vs database
- Redis cache vs Redis as shared state
- Queue vs topic
- Message vs event
- Synchronous vs asynchronous communication
- Correlation ID vs request ID vs trace ID
- Logs vs metrics vs traces
- Authentication vs authorization
- Horizontal vs vertical scaling
- Partitioning vs sharding
- Replication vs partitioning
- Availability vs durability
- Strong consistency vs eventual consistency
- Retry vs timeout
- Retry vs circuit breaker
- Rate limiting vs concurrency limiting
- Cache invalidation vs cache expiration
- Modular monolith vs microservices
- CQRS vs event sourcing
- Saga vs distributed transaction
- Outbox vs CDC
- Kubernetes vs application architecture

 Don't just define them. Explain WHEN and WHY each is useful.

 ## Database teaching

 Go deeply into database scaling.

 Start with:

 Indexes\
 ↓\
 Query optimization\
 ↓\
 N+1 problems\
 ↓\
 Transactions\
 ↓\
 Connection pooling\
 ↓\
 Caching\
 ↓\
 Read replicas\
 ↓\
 Replication lag\
 ↓\
 Partitioning\
 ↓\
 Sharding

 Explain why we should exhaust simpler database optimizations before sharding.

 Use realistic schemas and SQL where helpful.

 ## Redis teaching

 Don't teach Redis as simply "a cache."

 Show its different architectural uses:

 - Cache
- Session storage
- Rate limiting
- Distributed counters
- Idempotency keys
- Short-lived state
- Pub/sub where appropriate
- Distributed coordination where appropriate

 For each one explain:\
 "Why Redis instead of PostgreSQL?"\
 and also:\
 "When would Redis be the wrong choice?"

 ## Event-driven architecture

 Teach:

 Producer\
 ↓\
 Broker\
 ↓\
 Consumer

 Then progressively introduce:

 - Queues
- Topics
- Consumer groups
- Ordering
- Partitioning
- Delivery semantics
- At-least-once delivery
- Idempotency
- Retries
- Dead-letter queues
- Poison messages
- Backpressure
- Replay
- Event schemas
- Schema evolution
- Outbox pattern

 Explain Kafka/RabbitMQ/SQS/etc. by their architectural characteristics, not just product features.

 ## Microservices

 Do NOT present microservices as automatically better.

 First build a strong modular monolith.

 Then ask:

 "Should this module become a service?"

 Evaluate:

 - Independent deployment
- Independent scaling
- Team ownership
- Domain boundary
- Failure isolation
- Data ownership
- Different technology requirements
- Different availability requirements
- Communication overhead
- Operational complexity

 Teach me when NOT to extract a service.

 ## Observability

 I want this taught in detail.

 Show one request such as:

 POST /orders

 and follow it:

 Client\
 ↓\
 Load Balancer\
 ↓\
 API Gateway\
 ↓\
 Order Service\
 ↓\
 Database\
 ↓\
 Outbox\
 ↓\
 Kafka\
 ↓\
 Payment Service\
 ↓\
 Notification Worker

 Then show how:

 Correlation ID\
 Trace ID\
 Span IDs\
 Structured logs\
 Metrics

 allow an engineer to debug that request.

 I want examples of realistic log entries, metrics and traces.

 ## Production engineering

 Eventually cover:

 - Docker
- Container images
- CI/CD
- Kubernetes
- Health checks
- Readiness
- Liveness
- Autoscaling
- Rolling deployment
- Canary deployment
- Blue/green deployment
- Secrets
- Configuration
- Service discovery
- Network policies
- TLS
- WAF
- API Gateway
- Infrastructure as code
- Monitoring
- Alerting
- On-call
- Incident response
- Disaster recovery

 But always explain the underlying problem before introducing the technology.

 ## System design interview connection

 After we understand a topic, give me a small system-design question.

 For example:

 "Design a rate limiter for 1 million API requests/sec."

 Let me answer first.

 Then critique my design.

 Show:

 - What I got right
- What I missed
- What would fail
- What I'd change
- What trade-offs exist

 Eventually give me full system-design exercises such as:

 - URL shortener
- Ride sharing
- E-commerce checkout
- Payment system
- Notification system
- Chat system
- Video processing
- Search system
- Food delivery
- Job scheduler

 ## Code

 Use Node.js/TypeScript as the primary implementation language because that matches the reference project.

 However, explain architecture independently of the framework.

 I have extensive PHP experience, so occasionally compare Node.js concepts to PHP/PHP-FPM when that makes the concept clearer.

 Don't hide architectural concepts behind NestJS/framework magic.

 When useful, show:

 - API code
- Database schema
- SQL
- Redis commands
- Queue producer/consumer
- Event schema
- Docker configuration
- Kubernetes YAML
- Observability instrumentation

 But don't drown every explanation in code.

 Architecture first, code second.

 ## Repository discipline

 When we modify the reference project:

 1. First explain why we are changing it.
2. Show the BEFORE architecture.
3. Show the AFTER architecture.
4. Identify files/modules that would change.
5. Explain implementation.
6. Explain failure modes.
7. Explain how to test it.
8. Explain how to observe it.
9. Explain how to deploy it.

 Do not randomly refactor the project.

 Maintain a clear architectural evolution.

 ## Keep an architecture history

 At every major stage maintain:

 CURRENT ARCHITECTURE

 and:

 WHY WE GOT HERE

 For example:

 V0:\
 Single application

 V1:\
 Modular monolith

 V2:\
 Multiple application instances

 V3:\
 Redis

 V4:\
 Queue

 etc.

 At any point I should be able to ask:

 "Why do we have Redis?"

 and you should be able to answer:

 "We introduced it at V3 because X was failing. Before Redis we did Y. We considered Z. We chose Redis because..."

 ## Important teaching style

 Treat me as an experienced backend engineer who is new to large-scale distributed architecture, NOT as a beginner programmer.

 Do not waste time explaining basic programming concepts.

 Challenge my assumptions.

 If I propose something overly complicated, tell me.

 If I propose something unsafe, tell me.

 If a simpler architecture is sufficient, prefer it.

 Use phrases like:

 "You're solving a problem you don't have yet."

 "This introduces more operational complexity than the requirement justifies."

 "That works, but here is the hidden failure mode."

 "This is where a senior architect would ask..."

 "Before adding another technology, measure..."

 ## Most important rule

 NEVER introduce a technology merely because it is common in large systems.

 Every technology must have a reason.

 For example:

 Don't say:

 "We need Kafka because this is a large system."

 Instead:

 "We have independent consumers, high event volume, durable replay requirements, and consumers need to process events independently. Here are the alternatives. Kafka becomes reasonable because..."

 Likewise:

 Don't say:

 "We need Kubernetes because we're at 1 million users."

 Explain the actual operational requirements that justify orchestration.

 ## Start now

 First, inspect the repository:

 https://github.com/raouf-b-dev/ecommerce-store-api

 Then give me:

 1. A high-level summary of what the application actually does.
2. Repository structure.
3. Current architecture diagram.
4. Main modules/bounded contexts.
5. Request flow.
6. Database architecture.
7. Redis usage.
8. Messaging/event architecture.
9. Authentication/authorization.
10. Observability.
11. Deployment/Docker setup.
12. Current strengths.
13. Current weaknesses or potential scaling issues.
14. What I should understand before changing anything.
15. A proposed learning roadmap based specifically on this repository.

 Do NOT start modifying the architecture yet.

 First help me understand the current system as if I have joined the engineering team as a senior backend engineer.

 After that, we will begin the progressive "problem → solution → trade-off" journey one step at a time.