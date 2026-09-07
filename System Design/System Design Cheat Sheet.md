# System Design Cheat Sheet

## 1. Core Concepts

### Scalability

- **Vertical scaling** = bigger machine
- **Horizontal scaling** = more machines
- Prefer horizontal scaling for large systems.

### Availability vs Reliability

- **Availability**: system is up
- **Reliability**: system works correctly

### Latency vs Throughput

- **Latency** = time per request
- **Throughput** = requests per second

---

# 2. CAP Theorem

A distributed system can only guarantee 2 of:

- **C**onsistency
- **A**vailability
- **P**artition tolerance

Most modern systems choose:

- **CP** → banking
- **AP** → social media/feed systems

---

# 3. Load Balancing

Distributes traffic across servers.

## Types

- Round Robin
- Least Connections
- IP Hash
- Weighted RR

## Popular Tools

- NGINX
- HAProxy
- AWS Elastic Load Balancer

---

# 4. Caching

Improves speed by storing frequently accessed data.

## Cache Strategies

### Read Through

App checks cache first.

### Write Through

Write to DB + cache together.

### Write Back

Write cache first, DB later.

### Cache Aside

Application manages cache manually.

## Eviction Policies

- LRU
- LFU
- FIFO
- TTL

## Popular Cache

- Redis
- Memcached

---

# 5. Database Basics

## SQL vs NoSQL

| SQL            | NoSQL             |
| -------------- | ----------------- |
| Structured     | Flexible schema   |
| ACID           | BASE              |
| Joins          | Fast scaling      |
| MySQL/Postgres | MongoDB/Cassandra |

## Sharding

Split DB across machines.

Example:

- User IDs 1–1M → shard 1
- 1M–2M → shard 2

## Replication

- Primary → replicas
- Improves read scalability

---

# 6. Consistency Models

## Strong Consistency

All users see same data immediately.

## Eventual Consistency

Data syncs over time.

Used in:

- DNS
- Social feeds
- Caches

---

# 7. Messaging Queues

Decouple services asynchronously.

## Use Cases

- Email sending
- Order processing
- Notifications

## Popular MQ

- Apache Kafka
- RabbitMQ
- Amazon SQS

---

# 8. CDN (Content Delivery Network)

Stores content near users.

Benefits:

- Lower latency
- Reduced origin load
- Faster global delivery

Examples:

- Cloudflare
- Akamai Technologies

---

# 9. API Design

## REST

- Stateless
- HTTP methods
- JSON responses

## GraphQL

Client requests exact fields needed.

## gRPC

- Binary protocol
- High performance
- Internal microservices

---

# 10. Microservices

Split application into independent services.

## Pros

- Independent deployment
- Better scaling
- Team ownership

## Cons

- Complex debugging
- Network overhead
- Distributed tracing needed

---

# 11. Authentication & Security

## JWT

Stateless authentication token.

## OAuth

Third-party login delegation.

## Best Practices

- HTTPS everywhere
- Rate limiting
- Encrypt secrets
- Use API gateway

---

# 12. Rate Limiting

Protects services from abuse.

Algorithms:

- Token Bucket
- Leaky Bucket
- Fixed Window
- Sliding Window

---

# 13. Storage Types

## Blob Storage

Images/videos/files.

Examples:

- Amazon Web Services S3
- Google Cloud Cloud Storage

## Object Storage vs Block Storage

- Object = scalable files
- Block = fast disks for VMs/DBs

---

# 14. Monitoring & Observability

## Metrics

CPU, memory, latency

## Logging

Structured logs

## Tracing

Track requests across services.

Tools:

- Prometheus
- Grafana
- Jaeger

---

# 15. Common Architecture Patterns

## Monolith

Single deployable app.

## Microservices

Independent services.

## Event-Driven

Services communicate via events.

## CQRS

Separate read/write paths.

## Event Sourcing

Store events instead of state.

---

# 16. Database Indexing

Speeds up queries.

Tradeoff:

- Faster reads
- Slower writes

Types:

- B-Tree
- Hash Index
- Composite Index

---

# 17. Distributed Systems Basics

## Consensus Algorithms

- Raft
- Paxos

## Leader Election

One node becomes coordinator.

## Distributed Locking

Example:

- Apache ZooKeeper
- etcd

---

# 18. Popular System Design Interview Questions

- URL Shortener
- Instagram Feed
- WhatsApp Chat
- YouTube
- Uber
- Twitter/X Timeline
- Netflix
- Dropbox
- Notification System
- Rate Limiter

---

# 19. Quick Estimation Formulae

## Availability

99.9% → ~8.76 hours downtime/year

## Storage

```
daily_users × avg_data_per_user × retention_days
```

## QPS

```
requests_per_day / 86400
```

---

# 20. System Design Interview Framework

## Step-by-Step

### 1. Clarify Requirements

- Functional
- Non-functional

### 2. Estimate Scale

- Users
- QPS
- Storage

### 3. High-Level Design

- APIs
- DB
- Cache
- LB

### 4. Deep Dive

- Bottlenecks
- Scaling
- Failure handling

### 5. Tradeoffs

Always discuss:

- Cost
- Complexity
- Consistency
- Availability

---

# 21. Golden Rules

- Cache aggressively
- Make services stateless
- Design for failures
- Avoid single points of failure
- Prefer async processing
- Use idempotency
- Backpressure is important
- Monitor everything

---

# 22. One-Line Architecture Flow

```text
Client
  ↓
CDN
  ↓
Load Balancer
  ↓
API Servers
  ↓
Cache
  ↓
Database
  ↓
Message Queue / Async Workers
```

---

# 23. Most Important Tradeoffs

| Tradeoff                       | Choice                     |
| ------------------------------ | -------------------------- |
| SQL vs NoSQL                   | consistency vs scalability |
| Monolith vs Microservices      | simplicity vs flexibility  |
| Sync vs Async                  | simplicity vs resilience   |
| Strong vs Eventual Consistency | correctness vs performance |
| Cache vs Source of Truth       | speed vs freshness         |

---

# 24. Recommended Resources

Books:

- Designing Data-Intensive Applications
- System Design Interview – An Insider's Guide

Practice:

- [LeetCode System Design](https://leetcode.com/problemset/system-design/?utm_source=chatgpt.com)
- [High Scalability](https://highscalability.com/?utm_source=chatgpt.com)
- [ByteByteGo](https://bytebytego.com/?utm_source=chatgpt.com)
