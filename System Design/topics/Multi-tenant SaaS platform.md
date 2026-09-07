Absolutely. **Multi-tenant SaaS** is a very important system-design interview topic because it tests much more than APIs and databases. The key challenge is:

> **How do we allow many customers/organizations to use the same platform while keeping their data isolated, scalable, secure, and cost-effective?**

Think of SaaS products such as CRM, project management, accounting, HR, analytics, etc.

---

# 1. Example requirements

Let's design a SaaS platform where companies have organizations and users.

For example:

```text
Acme Corp
 ├── Alice
 ├── Bob
 └── Charlie

XYZ Corp
 ├── John
 └── Sarah
```

Users can:

* Create an organization/tenant
* Invite users
* Create projects
* Store business data
* Access APIs
* Manage roles/permissions
* Subscribe to plans
* See only their organization's data

Example APIs:

```http
POST /tenants
POST /tenants/{tenantId}/users
GET  /projects
POST /projects
GET  /projects/{id}
```

---

# 2. What does "tenant" mean?

A **tenant** is usually a customer/company using your SaaS platform.

For example:

```text
Tenant 1 = Amazon
Tenant 2 = Microsoft
Tenant 3 = Startup ABC
```

The important thing is:

```text
Tenant A
   │
   ├── Users
   ├── Projects
   ├── Orders
   └── Files

Tenant B
   │
   ├── Users
   ├── Projects
   ├── Orders
   └── Files
```

Tenant A must **never accidentally see Tenant B's data**.

That's the fundamental problem.

---

# 3. High-level architecture

A typical architecture:

```text
                         Internet
                            │
                            ▼
                     Load Balancer
                            │
                            ▼
                   API Gateway / Ingress
                            │
                            ▼
                  ┌───────────────────┐
                  │   API Services    │
                  │ PHP / Node.js     │
                  └─────────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
           Redis          Queue        Database
                                         │
                              ┌──────────┴──────────┐
                              ▼                     ▼
                          Tenant Data          Shared Data
```

But the most important architectural decision is:

> **How do we isolate tenant data?**

---

# 4. Three major database models

There are three common approaches.

### Model 1 — Shared database, shared tables

```text
                  PostgreSQL
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       users       projects      orders
          │           │           │
       tenant_id   tenant_id    tenant_id
```

Every tenant-specific row contains:

```text
tenant_id
```

Example:

```text
projects
------------------------------------------------
id | tenant_id | name
------------------------------------------------
1  | tenant_A  | CRM
2  | tenant_A  | Website
3  | tenant_B  | Mobile App
4  | tenant_B  | Analytics
```

This is called:

> **Shared database / shared schema**

This is usually the cheapest and easiest starting point.

---

# 5. Tenant ID is critical

Every tenant-owned table should normally have:

```text
tenant_id
```

For example:

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP
);
```

Then queries must always include:

```sql
SELECT *
FROM projects
WHERE tenant_id = :tenant_id;
```

Never:

```sql
SELECT *
FROM projects;
```

in a tenant-scoped API.

---

# 6. The biggest security danger

Suppose the request is:

```http
GET /projects/123
```

A developer might write:

```sql
SELECT *
FROM projects
WHERE id = 123;
```

That's dangerous.

What if:

```text
project 123 → Tenant B
```

but:

```text
current user → Tenant A
```

The API could leak Tenant B's data.

Instead:

```sql
SELECT *
FROM projects
WHERE id = :project_id
AND tenant_id = :current_tenant_id;
```

This is one of the **most important interview points**.

---

# 7. Where does tenant_id come from?

Never blindly trust:

```http
X-Tenant-ID: tenant_B
```

from the client.

A malicious user could change it.

Instead, determine tenant membership from authenticated identity.

For example JWT:

```json
{
  "user_id": "user_123",
  "tenant_id": "tenant_A"
}
```

Or:

```text
JWT
 │
 ▼
Authentication
 │
 ▼
User → Membership → Tenant
```

Database:

```text
users
-----
id
name

tenants
-------
id
name

tenant_users
------------
tenant_id
user_id
role
```

Then:

```text
user_123
   │
   ▼
tenant_users
   │
   ▼
tenant_A
```

---

# 8. Tenant context

In the application layer, establish tenant context at the beginning of the request:

```text
Request
  │
  ▼
Authentication
  │
  ▼
Identify User
  │
  ▼
Determine Tenant
  │
  ▼
Set TenantContext
  │
  ▼
Business Logic
```

For example conceptually:

```php
$tenantId = $request->user()->tenant_id;

TenantContext::set($tenantId);
```

Then repositories/services use the tenant context.

---

# 9. Defense in depth

Don't rely only on developers remembering:

```sql
WHERE tenant_id = ?
```

You want multiple layers of protection.

```text
                Request
                   │
                   ▼
              Auth Layer
                   │
                   ▼
            Tenant Context
                   │
                   ▼
           Authorization
                   │
                   ▼
           Repository Layer
                   │
                   ▼
          Database Isolation
```

For PostgreSQL, another powerful option is:

> **Row-Level Security (RLS)**

The database itself can enforce tenant boundaries.

Conceptually:

```text
Application
     │
     ▼
PostgreSQL RLS
     │
     ▼
Only rows belonging to current tenant
```

This provides an additional safety net.

---

# 10. Model 2 — Shared database, separate schema

Instead of:

```text
projects
tenant_id
```

you can have:

```text
tenant_a.projects
tenant_a.users

tenant_b.projects
tenant_b.users
```

Architecture:

```text
             PostgreSQL
          /      |       \
         ▼       ▼        ▼
    tenant_A  tenant_B  tenant_C
     schema    schema     schema
```

Advantages:

* Better logical isolation
* Easier tenant-level backup/export
* Less chance of accidental cross-tenant queries

Disadvantages:

* Many schemas become difficult to manage
* Migrations become harder
* Operational complexity increases

For hundreds/thousands of tenants, this may still be practical depending on the database and workload.

---

# 11. Model 3 — Database per tenant

For large enterprise customers:

```text
Tenant A
   ↓
Database A

Tenant B
   ↓
Database B

Tenant C
   ↓
Database C
```

Architecture:

```text
                         API
                          │
                     Tenant Router
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          DB-A          DB-B          DB-C
```

Advantages:

* Strong isolation
* Tenant-specific backup
* Tenant-specific restore
* Easier compliance boundaries
* One tenant's heavy workload is less likely to affect another

Disadvantages:

* Expensive
* More connections
* More migrations
* More operational complexity
* Monitoring becomes harder

---

# 12. Hybrid model

This is often the most realistic enterprise architecture.

```text
Small tenants
      │
      ▼
Shared DB
```

Large tenants:

```text
Enterprise Tenant
      │
      ▼
Dedicated DB
```

So:

```text
                   Tenant Router
                       │
          ┌────────────┼─────────────┐
          ▼            ▼             ▼
     Shared DB      Shared DB      Dedicated DB
      tenants       tenants       Enterprise A
```

For example:

```text
Tenant A → shared
Tenant B → shared
Tenant C → shared
Enterprise X → dedicated
Enterprise Y → dedicated
```

This gives you:

* Low cost for small customers
* Strong isolation for large customers
* Ability to move noisy tenants

---

# 13. Noisy neighbor problem

This is a major multi-tenant SaaS concept.

Suppose:

```text
Tenant A → 100 requests/sec
Tenant B → 200 requests/sec
Tenant C → 1,000,000 requests/sec
```

Tenant C could consume:

```text
CPU
Database connections
Redis
Queue
Network
```

and hurt everyone.

That's called:

> **Noisy neighbor problem**

---

# 14. Tenant-level rate limiting

Instead of only:

```text
1000 requests/IP
```

also use:

```text
tenant_A → 1000 RPS
tenant_B → 1000 RPS
tenant_C → 5000 RPS
```

Depending on subscription:

```text
Free
  → 100 RPS

Pro
  → 1000 RPS

Enterprise
  → 10000 RPS
```

Architecture:

```text
Request
   │
   ▼
API Gateway
   │
   ▼
Tenant Rate Limiter
   │
   ▼
API
```

Redis is commonly useful here.

---

# 15. Tenant-level quotas

Rate limits control traffic.

Quotas control resource consumption.

For example:

```text
Tenant
 ├── Max users = 100
 ├── Storage = 100 GB
 ├── API calls = 10M/month
 └── Projects = 1000
```

Before creating a resource:

```text
Current usage
     │
     ▼
Quota check
     │
 ┌───┴────┐
 ▼        ▼
Allowed  Rejected
```

---

# 16. Tenant-aware caching

Caching becomes tricky.

Bad:

```text
Redis:
project:123
```

What if project IDs collide across tenants?

Better:

```text
tenant:A:project:123
tenant:B:project:123
```

or:

```text
tenant_A:project:123
```

Similarly:

```text
tenant_A:user:123
tenant_B:user:123
```

Every cache key should include the tenant where tenant isolation matters.

---

# 17. Tenant-aware queues

Suppose:

```text
Tenant A → 100 jobs
Tenant B → 100 jobs
Tenant C → 10 million jobs
```

Tenant C could fill the queue.

Options:

```text
                 Queue
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   Tenant A     Tenant B     Tenant C
```

or use logical partitioning:

```text
hash(tenant_id)
       ↓
Partition
```

Then workers can process fairly.

For premium tenants, you might have:

```text
High priority queue
```

while normal tenants use:

```text
Standard queue
```

---

# 18. Tenant-aware background workers

Workers should also know the tenant.

Example job:

```json
{
  "job_id": "job_123",
  "tenant_id": "tenant_A",
  "type": "GENERATE_REPORT",
  "resource_id": "report_456"
}
```

Worker:

```text
Job
 │
 ▼
Tenant Context
 │
 ▼
Fetch tenant-specific data
 │
 ▼
Process
```

Never process a resource using only:

```text
resource_id
```

when resource IDs aren't globally unique or authorization needs tenant context.

---

# 19. Authentication vs authorization

These are separate.

### Authentication

> Who are you?

```text
JWT
 ↓
user_123
```

### Authorization

> What are you allowed to do?

```text
user_123
 ↓
tenant_A
 ↓
role = ADMIN
```

Then:

```text
POST /users
```

might be allowed.

But:

```text
GET /billing
```

might require:

```text
role = BILLING_ADMIN
```

---

# 20. RBAC

Most SaaS applications use:

> **Role-Based Access Control**

Example:

```text
Tenant A

Alice → OWNER
Bob   → ADMIN
John  → MEMBER
Mike  → VIEWER
```

Permissions:

```text
OWNER
 ├── manage billing
 ├── manage users
 └── manage settings

ADMIN
 ├── manage users
 └── manage projects

MEMBER
 └── manage assigned projects

VIEWER
 └── read only
```

Database:

```text
tenant_users
------------------------
tenant_id
user_id
role
```

For more complex systems:

```text
roles
permissions
role_permissions
tenant_users
```

---

# 21. Tenant onboarding

When a company signs up:

```text
POST /signup
```

Flow:

```text
User
 │
 ▼
Create Tenant
 │
 ▼
Create User
 │
 ▼
Create Membership
 │
 ▼
Assign OWNER role
 │
 ▼
Create default settings
 │
 ▼
Return access token
```

If provisioning dedicated infrastructure:

```text
Create Tenant
    │
    ▼
Provision DB
    │
    ▼
Run migrations
    │
    ▼
Create credentials
    │
    ▼
Mark tenant ACTIVE
```

For database-per-tenant systems, this becomes an asynchronous provisioning workflow.

---

# 22. Tenant lifecycle

A tenant can have states:

```text
PENDING
   │
   ▼
ACTIVE
   │
   ├────► SUSPENDED
   │
   ▼
CANCELLED
   │
   ▼
DELETED
```

For example, if subscription payment fails:

```text
ACTIVE
   ↓
PAST_DUE
   ↓
SUSPENDED
```

But you may still allow:

```text
login
data export
billing
```

while blocking normal application operations.

---

# 23. Subscription plans

A SaaS platform often has:

```text
Free
Pro
Business
Enterprise
```

Tenant configuration:

```text
tenant
--------------------
id
name
plan_id
status
```

Plan:

```text
plans
--------------------
id
name
max_users
max_storage
api_limit
features
```

---

# 24. Feature flags

Some features should only be available to certain tenants.

For example:

```text
Tenant A → basic reports
Tenant B → advanced analytics
Tenant C → AI features
```

Feature configuration:

```text
tenant_features
-------------------------
tenant_id
feature
enabled
```

Then:

```text
if featureEnabled(tenant, "advanced_reports"):
    ...
```

You can also use global feature flags plus tenant overrides.

---

# 25. Data partitioning at scale

Imagine:

```text
10 million tenants
```

with:

```text
100 billion rows
```

A single shared table becomes difficult.

You might partition by:

```text
tenant_id
```

or hash:

```text
hash(tenant_id)
```

Example:

```text
projects_0
projects_1
projects_2
...
projects_31
```

Tenant routing:

```text
hash(tenant_id) % 32
```

This can distribute data across partitions/shards.

---

# 26. Tenant migration

A sophisticated SaaS system should allow:

```text
Shared DB
   │
   │ Tenant grows
   ▼
Dedicated DB
```

For example:

```text
Tenant A
Shared DB
   ↓
Export tenant data
   ↓
Copy to Dedicated DB
   ↓
Validate
   ↓
Switch routing
   ↓
Dedicated DB
```

Tenant router:

```text
tenant_A → DB-1
tenant_B → Shared DB
tenant_C → Shared DB
```

This is a very strong design point for a senior interview.

---

# 27. Database routing

You may maintain:

```text
tenant_config
-------------------------
tenant_id
storage_type
database_cluster
database_name
```

Example:

```text
tenant_A → shared_cluster_1
tenant_B → shared_cluster_1
tenant_C → dedicated_cluster_7
```

Request:

```text
tenant_C
   │
   ▼
Tenant Router
   │
   ▼
cluster_7
```

---

# 28. File storage

If tenants upload files, don't store:

```text
tenant_A/photo.jpg
```

without sufficient isolation.

Use:

```text
tenants/{tenant_id}/files/{file_id}
```

Example:

```text
tenants/tenant_A/files/abc123
tenants/tenant_B/files/xyz456
```

And authorization still happens before generating download URLs.

---

# 29. Search

If using Elasticsearch/OpenSearch, tenant isolation is again important.

A document might contain:

```json
{
  "tenant_id": "tenant_A",
  "project_id": "123",
  "name": "Website"
}
```

Queries must be tenant scoped:

```text
tenant_id = tenant_A
AND query = "website"
```

Never let the frontend directly control tenant filtering.

---

# 30. Analytics

Analytics can become enormous.

You may have:

```text
Tenant A → 1M events
Tenant B → 5M events
Tenant C → 1B events
```

Don't necessarily put everything into your transactional DB.

Instead:

```text
API
 │
 ▼
Kafka
 │
 ▼
Analytics Pipeline
 │
 ▼
Data Warehouse
```

Then query analytics separately.

---

# 31. Audit logs

Enterprise SaaS applications often need audit logs.

Example:

```text
Alice changed Bob's role
```

Store:

```text
audit_logs
--------------------------------------------
tenant_id
actor_user_id
action
resource_type
resource_id
metadata
created_at
```

Example:

```text
tenant_A
user_123
ROLE_CHANGED
user
user_456
ADMIN → MEMBER
```

Audit logs are especially important for security/compliance.

---

# 32. Backup and restore

Shared database:

```text
Entire DB backup
```

But a customer might ask:

> "Restore only my tenant."

That's harder.

You need tenant-aware backup/export strategies.

For example:

```text
Nightly DB backup
       +
Tenant-level logical export
```

For database-per-tenant:

```text
Tenant A DB
   ↓
Backup A

Tenant B DB
   ↓
Backup B
```

Much easier to restore one customer independently.

This is one reason enterprise customers may justify dedicated databases.

---

# 33. Security architecture

A good multi-tenant system has several isolation layers:

```text
                   Request
                      │
                      ▼
                 Authentication
                      │
                      ▼
                 Tenant Context
                      │
                      ▼
                 Authorization
                      │
                      ▼
               Application Filter
                      │
                      ▼
               Database Isolation
                      │
                      ▼
                 Object Storage
```

Never rely on only one layer.

---

# 34. High-level architecture

Now let's combine everything:

```text
                              INTERNET
                                  │
                                  ▼
                         ┌────────────────┐
                         │ WAF / Gateway  │
                         └───────┬────────┘
                                 │
                                 ▼
                          Load Balancer
                                 │
                                 ▼
                     ┌─────────────────────┐
                     │ Stateless API       │
                     │ PHP / Node.js       │
                     └──────────┬──────────┘
                                │
                         Authenticate
                                │
                         Resolve Tenant
                                │
                         Authorize User
                                │
                ┌───────────────┼────────────────┐
                ▼               ▼                ▼
             Redis          Queue/Kafka      Tenant Router
                │                                │
                │                       ┌────────┴────────┐
                │                       ▼                 ▼
                │                   Shared DB        Dedicated DB
                │
                ▼
          Tenant-aware Cache


          Background Processing
                    │
                    ▼
               Queue/Kafka
                    │
          ┌─────────┼──────────┐
          ▼         ▼          ▼
       Worker    Worker     Worker
          │         │          │
          ▼         ▼          ▼
       Email     Reports    Analytics


          File Storage
               │
               ▼
        Object Storage
               │
               ▼
              CDN
```

---

# 35. PHP implementation

For Laravel/Symfony, I would structure the request around a tenant context.

Conceptually:

```text
Middleware
    │
    ├── Authenticate
    │
    ├── ResolveTenant
    │
    └── Authorize
            │
            ▼
       Controller
            │
            ▼
       Service Layer
            │
            ▼
       Repository
            │
            ▼
       Tenant-scoped DB
```

Example:

```php
$tenantId = $request->user()->tenant_id;

$projects = Project::where(
    'tenant_id',
    $tenantId
)->get();
```

But in a large codebase, don't rely on every developer remembering this manually. Build tenant scoping into your repository/model/query architecture and, where appropriate, database-level controls.

---

# 36. Node.js implementation

Similar architecture:

```text
Express / Fastify / NestJS
          │
          ▼
     Auth Middleware
          │
          ▼
     Tenant Middleware
          │
          ▼
     Authorization
          │
          ▼
       Service
          │
          ▼
       Repository
          │
          ▼
      PostgreSQL
```

Request context might conceptually contain:

```javascript
{
  userId: "user_123",
  tenantId: "tenant_A",
  role: "ADMIN"
}
```

Every downstream operation uses that context.

---

# 37. What happens when one tenant has huge traffic?

This is where the design becomes interesting.

Suppose:

```text
Tenant A → 100 RPS
Tenant B → 200 RPS
Tenant C → 500K RPS
```

We can progressively isolate Tenant C:

```text
                 Tenant Router
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Shared      Shared      Dedicated
        APIs        APIs          APIs
                                  │
                                  ▼
                            Dedicated DB
                                  │
                                  ▼
                            Dedicated Queue
```

So our architecture can evolve with tenant size.

---

# 38. Multi-tenant API request flow

Let's walk through one request.

```http
GET /projects/123
Authorization: Bearer JWT
```

### Step 1

Gateway validates the request.

```text
Gateway
 ↓
API
```

### Step 2

API validates JWT.

```text
JWT
 ↓
user_123
```

### Step 3

Resolve membership:

```text
user_123
 ↓
tenant_A
 ↓
ADMIN
```

### Step 4

Create tenant context:

```text
tenant_id = tenant_A
```

### Step 5

Query:

```sql
SELECT *
FROM projects
WHERE id = 123
AND tenant_id = 'tenant_A';
```

### Step 6

Return data.

This entire flow prevents:

```text
Tenant A → Tenant B data ❌
```

---

# 39. Interview trade-offs

| Model             |        Cost |   Isolation | Complexity | Best for              |
| ----------------- | ----------: | ----------: | ---------: | --------------------- |
| Shared DB/schema  |         Low |  Low/Medium |        Low | Many small tenants    |
| Schema per tenant |      Medium | Medium/High |     Medium | Moderate tenant count |
| DB per tenant     |        High |        High |       High | Enterprise tenants    |
| Hybrid            | Medium/High |        High |       High | Mature SaaS           |

There isn't one universally correct answer.

A strong interview answer says:

> "I'd start with shared schema plus tenant_id because it is operationally simple and cost-efficient. As some tenants become larger or require stronger isolation, I'd support moving those tenants to dedicated schemas or databases using a tenant-routing layer."

That's much better than saying:

> "Every tenant gets its own database."

from the beginning.

---

# 40. The mental model to remember

For **Multi-Tenant SaaS**, remember these six concepts:

```text
                 MULTI-TENANT SAAS
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   DATA ISOLATION   AUTHORIZATION   NOISY NEIGHBOR
        │               │                │
   tenant_id          RBAC          rate limits
   RLS                roles          quotas
   separate DB        permissions    resource limits
        │
        ▼
   SCALING MODEL
        │
   ┌────┼──────────┐
   ▼    ▼          ▼
Shared Schema   Schema   DB per Tenant
                  │
                  ▼
                Hybrid
```

And then:

```text
Tenant-aware
 ├── Cache
 ├── Queue
 ├── File storage
 ├── Search
 ├── Analytics
 ├── Rate limits
 └── Audit logs
```

### The interview sentence I'd memorize:

> **"I'd model tenant identity explicitly and establish tenant context after authentication. Every data access, cache key, queue job, file path, and authorization decision would be tenant-aware. I'd start with a shared database using tenant_id and strong database/application isolation, then move large or enterprise tenants to dedicated databases through a tenant-routing layer. I'd also enforce per-tenant rate limits and quotas to prevent noisy neighbors."**

That is the **core architecture and reasoning** behind a production-grade multi-tenant SaaS platform.
