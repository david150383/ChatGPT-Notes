Absolutely. **URL Shortener** is one of the best system-design interview problems because it looks simple but lets you discuss **database design, ID generation, caching, scalability, collision handling, read/write patterns, replication, and eventual consistency**.

Think of something like:

```text
https://example.com/products/iphone/123456789
```

becoming:

```text
https://sho.rt/aB92xK
```

When someone visits `aB92xK`, we redirect them to the original URL.

---

# 1. Requirements

### Functional requirements

We need two main operations:

### Create short URL

```http
POST /v1/urls
```

Input:

```json
{
  "url": "https://example.com/products/iphone/123456789"
}
```

Response:

```json
{
  "short_url": "https://sho.rt/aB92xK"
}
```

### Redirect

```http
GET /aB92xK
```

Response:

```text
HTTP 301/302
Location: https://example.com/products/iphone/123456789
```

Optional features:

* Custom aliases
* Expiration
* User ownership
* Analytics
* Click counts
* QR codes
* URL management
* Rate limiting

For the interview, start with the **core requirements** and add advanced features later.

---

# 2. First important question: Read-heavy or write-heavy?

URL shorteners are typically **extremely read-heavy**.

Imagine:

```text
100 million redirects/day
```

but only:

```text
10 million URLs created/day
```

The ratio might be roughly:

```text
Reads  >>>>> Writes
```

Therefore our architecture should optimize the redirect path.

This immediately suggests:

```text
Cache
  +
Read replicas
  +
Simple key-value lookup
```

---

# 3. High-level architecture

Start with:

```text
                       ┌─────────────┐
                       │   Client    │
                       └──────┬──────┘
                              │
                              ▼
                       ┌─────────────┐
                       │Load Balancer│
                       └──────┬──────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              API Server           API Server
                    │                   │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                  Redis              Database
                 Cache              PostgreSQL
                                      / MySQL
```

Redirect:

```text
Client
  │
  │ GET /aB92xK
  ▼
Load Balancer
  │
  ▼
URL Service
  │
  ▼
Redis
  │
  ├── HIT ──────► Original URL
  │
  └── MISS
       │
       ▼
    Database
       │
       ▼
    Redis
       │
       ▼
 Original URL
```

---

# 4. Database design

A simple table:

```text
urls
------------------------------------------------
id
short_code
original_url
user_id
created_at
expires_at
status
```

Example:

```text
id          = 123456
short_code  = aB92xK
original_url = https://example.com/products/123
user_id     = 456
created_at  = ...
expires_at  = ...
status      = ACTIVE
```

Create a unique index:

```text
UNIQUE(short_code)
```

This is critical.

---

# 5. How do we generate `aB92xK`?

This is probably the **most important URL-shortener interview question**.

There are several approaches.

## Approach 1: Random string

Generate:

```text
aB92xK
```

using characters:

```text
a-z
A-Z
0-9
```

That's:

```text
62 characters
```

For a 6-character code:

```text
62^6 = 56,800,235,584
```

Approximately **56.8 billion combinations**.

Collision probability is therefore low for moderate scale, but collisions are still possible.

So:

```text
Generate
   ↓
Check DB
   ↓
Already exists?
   ├── YES → generate again
   └── NO  → save
```

---

# 6. Approach 2: Auto-increment ID + Base62

This is a very common interview solution.

Database generates:

```text
id = 123456
```

Then convert:

```text
123456
```

to Base62:

```text
aB92xK
```

Characters:

```text
0-9
a-z
A-Z
```

So:

```text
Database ID
     ↓
Base62 encoding
     ↓
Short code
```

Example:

```text
1       → 1
10      → A
61      → Z
62      → 10
123456  → some Base62 value
```

The exact output depends on the character ordering.

### Why is this attractive?

Because we don't have to randomly generate a string and check for collisions.

The ID is unique.

```text
ID = 123456
        ↓
Base62
        ↓
abcXYZ
```

No collision.

---

# 7. But auto-increment has a scalability problem

Suppose you have multiple application/database regions:

```text
India DB
US DB
Europe DB
```

All generating IDs:

```text
1
2
3
4
```

You can't simply use independent auto-increment sequences because they can overlap.

Solutions include:

### Database sequence allocation

Allocate ranges:

```text
India → 1 - 1,000,000
US    → 1,000,001 - 2,000,000
EU    → 2,000,001 - 3,000,000
```

### Snowflake-style IDs

Generate globally unique IDs using:

```text
timestamp
+
machine/datacenter ID
+
sequence
```

Then:

```text
Snowflake ID
     ↓
Base62
     ↓
Short URL
```

This is more suitable for very large distributed systems.

---

# 8. Random vs Base62 ID

In an interview, you can say:

| Approach           | Advantage                 | Problem               |
| ------------------ | ------------------------- | --------------------- |
| Random Base62      | Simple, distributed       | Collision checking    |
| DB ID + Base62     | Simple and collision-free | Central ID generation |
| Snowflake + Base62 | Highly scalable           | More complexity       |

For a normal URL shortener:

> **DB ID + Base62 is a great starting point.**

For a globally distributed system:

> **Snowflake-style ID + Base62 is more scalable.**

---

# 9. Base62 encoding

Conceptually:

```text
characters =
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

If:

```text
ID = 125
```

we repeatedly divide by:

```text
62
```

and use the remainders as indexes into the character set.

You don't need to implement the mathematical details during a system-design interview unless asked.

The important architecture is:

```text
Unique ID
   ↓
Base62 Encode
   ↓
Short Code
```

---

# 10. Redirect flow

This is the most important request path because redirects are read-heavy.

User requests:

```text
GET /aB92xK
```

Flow:

```text
                   GET /aB92xK
                         │
                         ▼
                  Load Balancer
                         │
                         ▼
                   URL Service
                         │
                         ▼
                  Redis Cache
                    /       \
                  HIT       MISS
                   │          │
                   │          ▼
                   │       Database
                   │          │
                   │          ▼
                   │       Redis SET
                   │
                   └──────┬───────
                          ▼
                    Original URL
                          │
                          ▼
                    HTTP Redirect
```

This means most traffic doesn't hit the database.

---

# 11. 301 vs 302 redirect

This is a nice interview detail.

### 301

```text
Permanent redirect
```

Browsers/CDNs may cache it aggressively.

Good for performance, but it can make changing the destination harder.

### 302

```text
Temporary redirect
```

Gives us more control.

For a URL shortener where analytics and destination changes matter, **302 is often a safer choice** depending on product requirements.

You should say:

> "I'd choose 301 or 302 based on whether the redirect is intended to be permanently cacheable and whether we need flexibility around destination changes and analytics."

---

# 12. Cache design

Use Redis:

```text
key:
url:aB92xK

value:
https://example.com/products/123
```

For example:

```text
Redis

url:aB92xK
      ↓
https://example.com/products/123
```

Redirect becomes:

```text
GET /aB92xK
     ↓
Redis
     ↓
Original URL
```

Very fast.

---

# 13. Cache-aside pattern

When cache misses:

```text
Redis
  │
  │ MISS
  ▼
Database
  │
  ▼
Redis SET
  │
  ▼
Return URL
```

Pseudo-flow:

```text
url = Redis.get(shortCode)

if url exists:
    return redirect(url)

url = DB.find(shortCode)

if url exists:
    Redis.set(shortCode, url)

return redirect(url)
```

This is called **cache-aside**.

---

# 14. Cache invalidation

Suppose a user changes:

```text
aB92xK
```

from:

```text
https://example.com/A
```

to:

```text
https://example.com/B
```

We need:

```text
DB update
   ↓
Redis delete/update
```

Otherwise Redis might continue returning the old URL.

For this reason, the redirect path and update path need a clear cache consistency strategy.

---

# 15. What if Redis goes down?

Important question.

We don't want:

```text
Redis DOWN
   ↓
URL shortener DOWN ❌
```

Instead:

```text
Redis DOWN
   ↓
Fallback to Database
```

Architecture:

```text
Request
   │
   ▼
Redis
   │
   X
   │
   ▼
Database
```

Performance decreases, but correctness remains.

This illustrates an important principle:

> **Cache should generally be an optimization, not the source of truth.**

---

# 16. Database scaling

At large scale, one database may not be enough.

We can use:

```text
                Primary
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       Replica   Replica   Replica
```

Reads:

```text
Redirect
   ↓
Read Replica
```

Writes:

```text
Create URL
   ↓
Primary
```

But remember:

**Read replicas are eventually consistent.**

That creates an interesting issue.

---

# 17. Read-after-write problem

User creates:

```text
short URL = aB92xK
```

Then immediately clicks it.

Write:

```text
Primary
   ↓
aB92xK created
```

But replica hasn't received the update yet:

```text
Replica
   ↓
aB92xK not found
```

User gets:

```text
404 ❌
```

Possible solutions:

### Read from primary for a short period

or

### Write-through cache

After creating:

```text
DB
 +
Redis
```

So the redirect immediately finds the URL in Redis.

This is another reason caching is useful beyond performance.

---

# 18. Hot URLs

Suppose someone creates a viral URL:

```text
sho.rt/abc123
```

and suddenly:

```text
10 million requests/sec
```

Without protection:

```text
10M requests
      ↓
Database ❌
```

With Redis:

```text
10M requests
      ↓
Load Balancer
      ↓
Redis
      ↓
Original URL
```

But even Redis can become a bottleneck for extremely hot keys.

Possible solutions:

* Redis cluster
* CDN caching
* Local in-process cache
* Replicated cache
* Request coalescing

For most interviews, **Redis + CDN** is sufficient to mention.

---

# 19. CDN

Because redirect requests are read-heavy, a CDN can be useful:

```text
User
  │
  ▼
CDN
  │
  ├── Cache HIT → Redirect
  │
  └── MISS
       ↓
    URL Service
```

Potentially:

```text
User
  ↓
CloudFront / Cloudflare
  ↓
URL Service
  ↓
Redis
  ↓
DB
```

But CDN caching of redirects needs careful consideration around:

* 301/302 behavior
* TTL
* destination updates
* analytics
* privacy

---

# 20. Analytics

Suppose we want:

```text
Total clicks
Unique users
Country
Device
Browser
Referrer
Timestamp
```

**Don't make the redirect request wait for analytics.**

Bad:

```text
Redirect
   ↓
Save analytics
   ↓
Return 302
```

Instead:

```text
GET /aB92xK
      │
      ├──────────────► Redis → URL → 302
      │
      └──────────────► Event Queue
                            │
                            ▼
                         Kafka
                            │
                            ▼
                    Analytics Workers
```

The redirect remains fast.

---

# 21. Analytics storage

Don't necessarily store billions of click events in your main relational database.

You could use:

```text
Kafka
  ↓
Analytics pipeline
  ↓
ClickHouse / BigQuery / Elasticsearch
```

depending on requirements.

Main URL DB:

```text
short_code → original_url
```

Analytics system:

```text
click event → analytics storage
```

Keep the two concerns separate.

---

# 22. Expiration

We may support:

```text
expires_at
```

Example:

```text
short URL
   ↓
expires_at = 2026-09-01
```

On redirect:

```text
if now > expires_at:
    return 404/410
```

Redis TTL can also help:

```text
Redis SETEX
```

But the database remains the source of truth.

---

# 23. Custom aliases

User might request:

```text
POST /v1/urls

{
    "url": "https://example.com",
    "custom_alias": "my-product"
}
```

Result:

```text
https://sho.rt/my-product
```

We need:

```text
UNIQUE(short_code)
```

If `my-product` already exists:

```text
409 Conflict
```

---

# 24. Security concerns

A URL shortener can become an abuse platform.

Potential problems:

```text
Malware URLs
Phishing
Spam
Illegal content
Bot abuse
```

Therefore consider:

* Rate limiting
* Authentication for creation
* URL validation
* Malware/phishing detection
* Domain reputation checks
* Abuse reporting
* CAPTCHA for suspicious traffic
* Blocklists
* Monitoring

Also don't blindly fetch the submitted URL from your backend just to "validate" it, because that can introduce SSRF risks.

---

# 25. Rate limiting

Without rate limiting:

```text
Attacker
   │
   ├── 1M URLs
   ├── 1M URLs
   ├── 1M URLs
   └── ...
```

Could overwhelm the system.

Use something like:

```text
Redis
  ↓
Rate limiter
  ↓
Create URL API
```

For example:

```text
100 URL creations / minute / user
```

Redirect traffic may have a different rate-limit strategy because legitimate popular URLs can generate huge traffic.

---

# 26. Complete architecture

Now combine everything:

```text
                              Internet
                                  │
                                  ▼
                           ┌─────────────┐
                           │ CDN / WAF   │
                           └──────┬──────┘
                                  │
                                  ▼
                           Load Balancer
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
               URL Service                  URL Service
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                         ┌────────┴────────┐
                         │                 │
                         ▼                 ▼
                      Redis            Database
                     Cluster           Primary
                                         │
                                  ┌──────┴──────┐
                                  ▼             ▼
                               Replica       Replica


CREATE URL:
───────────

Client
  │
  ▼
URL Service
  │
  ▼
Generate ID
  │
  ▼
Base62 Encode
  │
  ▼
DB
  │
  ▼
Redis
  │
  ▼
Return short URL


REDIRECT:
─────────

GET /aB92xK
      │
      ▼
     CDN
      │
      ▼
URL Service
      │
      ▼
   Redis
    /   \
  HIT   MISS
   │      │
   │      ▼
   │    DB
   │      │
   │      ▼
   │    Redis
   │
   ▼
HTTP 302
   │
   ▼
Original URL


ANALYTICS:
──────────

Redirect
   │
   ├──────► Return 302 immediately
   │
   └──────► Kafka
               │
               ▼
         Analytics Worker
               │
               ▼
         Analytics DB
```

---

# 27. PHP / Node.js implementation

### PHP

```text
Nginx
  ↓
PHP-FPM
  ↓
Laravel/Symfony
  ↓
Redis
  ↓
MySQL/PostgreSQL
```

For analytics:

```text
PHP
 ↓
Kafka/SQS
 ↓
Worker
```

### Node.js

```text
Load Balancer
      ↓
Node.js
      ↓
Redis
      ↓
PostgreSQL/MySQL
```

And:

```text
Node.js
   ↓
Kafka/SQS
   ↓
Worker
```

For this particular problem, **Node.js doesn't automatically make the system more scalable than PHP**. The main scaling factors are the architecture, cache, database, load balancing, and ID-generation strategy.

---

# 28. Questions the interviewer will probably ask

Be ready for these:

### Q1. How do you generate unique short codes?

Answer:

> DB-generated ID + Base62 initially; Snowflake-style IDs for globally distributed generation.

### Q2. What if two requests generate the same code?

Answer:

> Use a unique database constraint. With random generation, retry on collision. With a globally unique ID converted to Base62, collisions are avoided.

### Q3. Why Redis?

> Redirects are read-heavy, so caching `short_code → original_url` dramatically reduces database load.

### Q4. What if Redis goes down?

> Fall back to the database. Cache is not the source of truth.

### Q5. What if a URL becomes viral?

> CDN + Redis cluster + horizontal URL-service scaling.

### Q6. How do you handle analytics without slowing redirects?

> Publish click events asynchronously to Kafka/SQS and process them separately.

### Q7. How do you scale the database?

> Read replicas for redirect lookups, sharding if the dataset becomes too large, and potentially partitioning based on the key strategy.

### Q8. What if the user creates a URL and immediately redirects?

> Write to the primary and cache the newly created mapping, avoiding read-after-write issues from replicas.

---

# 29. The most important concepts to remember

For the interview, I'd remember this mental model:

```text
             URL SHORTENER

CREATE
──────
URL
 │
 ▼
Generate Unique ID
 │
 ▼
Base62
 │
 ▼
DB + Redis
 │
 ▼
Short URL


REDIRECT
────────
Short Code
 │
 ▼
Redis
 │
 ├── HIT ──► Original URL ──► 302
 │
 └── MISS
       │
       ▼
      DB
       │
       ▼
     Redis
       │
       ▼
   Original URL
       │
       ▼
      302


ANALYTICS
─────────
Redirect
   │
   ├────► 302 immediately
   │
   └────► Kafka
             │
             ▼
       Analytics Pipeline
```

### The 8 concepts I'd make sure you can explain

1. **Base62 encoding**
2. **Unique ID generation**
3. **Redis caching**
4. **Read-heavy architecture**
5. **Database replication/sharding**
6. **Hot-key/viral URL handling**
7. **Asynchronous analytics**
8. **301 vs 302 redirects**

The **next level** for this problem is to do the **capacity estimation**: e.g. *1 billion URLs, 100 million redirects/day, storage required, Redis memory, QPS, database size, and how many Node.js/PHP instances we'd need*. That's usually where a URL-shortener interview question becomes a full system-design discussion.
