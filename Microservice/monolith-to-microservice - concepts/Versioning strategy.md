“Versioning strategy” means:

> A planned approach for handling changes in APIs, services, events, or contracts without breaking existing consumers.

In simple words:

- how your system evolves safely over time.

This is extremely important in microservices because:

- many services depend on each other
- frontend/mobile apps depend on APIs
- different versions may coexist
- deployments happen independently

---

# Why Versioning Is Needed

Imagine this API response:

## Current API

```json id="2n6vvw"
{
  "name": "John"
}
```

Frontend/mobile apps use:

```text id="w0zdbs"
response.name
```

Now backend changes API to:

```json id="vk6w7j"
{
  "fullName": "John"
}
```

Suddenly:

- frontend breaks
- mobile apps crash
- integrations fail

This is a breaking change.

Versioning prevents this chaos.

---

# What Needs Versioning?

In distributed systems:

- REST APIs
- gRPC contracts
- events/messages
- database schemas
- mobile APIs
- shared libraries

can all require versioning strategies.

---

# API Versioning Example

Most common example.

---

# Without Versioning

```text id="b4np1u"
GET /users/123
```

Behavior changes unexpectedly.

Consumers break.

---

# With Versioning

```text id="20gnv1"
GET /api/v1/users/123
GET /api/v2/users/123
```

Now:

- old clients continue using v1
- new clients adopt v2 gradually

Safer evolution.

---

# Common Versioning Strategies

---

# 1. URL Versioning (Most Common)

Example:

```text id="j40g6q"
/api/v1/orders
/api/v2/orders
```

Easy to understand.

Widely used.

---

# 2. Header Versioning

Example:

```text id="9ixq6u"
Accept: application/vnd.company.v2+json
```

Cleaner URLs but more complex.

---

# 3. Query Parameter Versioning

Example:

```text id="v7txku"
 /users?version=2
```

Less common.

---

# 4. Semantic Versioning

Very common in libraries/services.

Format:

```text id="m5f4p6"
MAJOR.MINOR.PATCH
```

Example:

```text id="1j3ij0"
2.5.1
```

Meaning:

- MAJOR → breaking changes
- MINOR → backward-compatible features
- PATCH → bug fixes

---

# Example

```text id="wtlyz4"
1.0.0
```

Add optional field:

```text id="5d8mlo"
1.1.0
```

Fix bug:

```text id="gmsq7d"
1.1.1
```

Breaking API change:

```text id="9ol8j0"
2.0.0
```

---

# Backward Compatibility (Very Important)

Good versioning strategies try to:

> avoid breaking old consumers.

Example:
Instead of replacing:

```json id="7j8x0j"
"name"
```

Add:

```json id="31twz0"
{
  "name": "John",
  "fullName": "John Doe"
}
```

Older clients still work.

This is backward compatibility.

---

# Why This Matters More in Microservices

Imagine:

- 50 services
- independent deployments

If one service changes API carelessly:

- multiple downstream services break

Now production incident happens.

Versioning strategy prevents cascading integration failures.

---

# Example in Microservices

---

## Payment Service v1

```json id="m9j0y5"
{
  "amount": 100
}
```

Order Service depends on it.

---

## New Requirement

Need currency support.

Bad change:

```json id="n1aqi8"
{
  "value": 100,
  "currencyCode": "USD"
}
```

Old consumers break.

---

## Better Strategy

Versioned API:

```text id="2q7z3f"
 /v1/payments
 /v2/payments
```

or backward-compatible response:

```json id="jlwm5m"
{
  "amount": 100,
  "currency": "USD"
}
```

---

# Event Versioning (Very Important)

Microservices often use events.

Example:

```text id="uoqg55"
OrderCreated
```

Event schema evolves over time.

---

# Problem

Consumer expects:

```json id="1d7ztx"
{
  "orderId": 1
}
```

Producer changes to:

```json id="w2e5sp"
{
  "id": 1
}
```

Consumers fail silently or crash.

---

# Better

Version events:

```text id="g8jz0k"
OrderCreatedV1
OrderCreatedV2
```

or maintain backward compatibility.

---

# Database Versioning

Schema changes also need strategy.

Example:

- adding columns
- renaming fields
- changing constraints

Good migrations:

- avoid downtime
- support old/new app versions simultaneously

Tools:

- Flyway
- Liquibase

---

# Mobile Apps Make Versioning Harder

Mobile clients may remain outdated for months.

You cannot force immediate upgrades.

Therefore:

- APIs must support older versions longer

Very important for public/mobile APIs.

---

# Common Bad Practices

---

# 1. Breaking Changes Without Versioning

Suddenly changing:

- field names
- response formats
- required parameters

Production breaks.

---

# 2. Too Many Versions

Example:

```text id="t6tzw5"
v1
v2
v3
v4
v5
v6
```

Maintenance nightmare.

Need deprecation strategy.

---

# 3. No Deprecation Policy

Consumers need warning before removal.

Good process:

```text id="hzc0r5"
v1 deprecated
support ends in 6 months
```

---

# 4. Tight Consumer Coupling

Consumers depending on:

- internal implementation
- undocumented fields

Makes evolution difficult.

---

# Good Versioning Principles

---

# Prefer Backward-Compatible Changes

Adding optional fields is safer than renaming/removing.

---

# Version Only When Necessary

Not every small change requires new version.

---

# Communicate Deprecation Clearly

Avoid surprise breakages.

---

# Keep Contracts Stable

APIs are promises.

Breaking them has business impact.

---

# Real-World Example

Stripe is famous for careful API versioning:

- strong backward compatibility
- version pinning
- predictable upgrades

This reduces integration pain.

---

# Example Timeline

---

## Initial API

```text id="b4g0ml"
v1/users
```

---

## Add Optional Feature

No breaking change needed.

---

## Major Structural Change

Introduce:

```text id="qv6ndf"
v2/users
```

---

## Migration Period

Both versions coexist.

---

## Deprecation

Announce v1 removal later.

---

# Why Versioning Strategy Matters Before Microservices

In monolith:

- internal changes easier to coordinate

In microservices:

- independent deployments
- distributed ownership
- asynchronous updates

Without versioning discipline:

- integrations become fragile
- deployments risky
- outages frequent

---

# Simple Analogy

Think of electrical plugs.

If every new device changed plug shape instantly:

- old devices stop working

Versioning ensures:

- old systems continue functioning
- migration happens gradually

---

# Final Takeaway

“Versioning strategy” means:

- safely evolving APIs/contracts over time
- handling breaking changes intentionally
- preserving backward compatibility when possible
- enabling independent deployments
- preventing consumer breakage

It is one of the foundational operational disciplines in successful microservice architectures.
