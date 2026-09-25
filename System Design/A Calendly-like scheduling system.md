A **Calendly-like scheduling system** allows users to create availability, share booking links, schedule meetings, integrate with calendars, and send notifications. Below is a structured **system design** covering functional requirements, non-functional requirements, data model, and architecture.

# 1. Functional Requirements

## Core Features

### User Management

* User registration and login
* OAuth login (Google, Microsoft, Apple)
* User profile management
* Time zone preferences

### Availability Management

* Create weekly availability schedules
* Define working hours
* Block unavailable times
* Add vacations and holidays
* Buffer time before/after meetings
* Set minimum scheduling notice

### Event Types

* One-on-one meetings
* Group meetings
* Round-robin meetings
* Collective meetings (multiple hosts)
* Different meeting durations (15, 30, 60 mins)

### Booking

* Public booking links
* Custom booking URLs
* Check real-time availability
* Book meetings
* Cancel meetings
* Reschedule meetings

### Calendar Integration

* Google Calendar
* Outlook Calendar
* Apple Calendar
* Two-way synchronization
* Conflict detection

### Notifications

* Email confirmations
* SMS reminders
* Push notifications
* Calendar invitations
* Cancellation notifications

### Video Conferencing

* Generate Zoom meeting
* Google Meet links
* Microsoft Teams links

### Payments (Optional)

* Paid consultations
* Stripe integration
* Refund support

### Admin Features

* User management
* Analytics dashboard
* Subscription plans
* Usage monitoring

---

# 2. Non-Functional Requirements

## Scalability

* Support millions of users
* Thousands of bookings/sec
* Horizontal scalability

## Availability

* 99.99% uptime
* Multi-region deployment

## Reliability

* No double bookings
* Eventual consistency for sync
* Retry mechanisms

## Performance

| Operation            | Target  |
| -------------------- | ------- |
| Load booking page    | <200 ms |
| Availability lookup  | <100 ms |
| Create booking       | <300 ms |
| Notification trigger | <1 sec  |

## Security

* OAuth2 authentication
* JWT tokens
* Encryption at rest
* TLS
* RBAC
* Rate limiting

## Consistency

* Strong consistency for bookings
* Eventual consistency for calendar synchronization

## Fault Tolerance

* Retry failed calendar sync
* Dead Letter Queue (DLQ)
* Circuit breaker

---

# 3. Capacity Estimation

Suppose:

* 20 Million users
* 2 Million daily active users
* 10 bookings/user/month

Bookings/day

```
20M × 10 / 30
≈ 6.7 Million bookings/day
≈ 80 bookings/sec
Peak ≈ 500 bookings/sec
```

Availability lookups

```
100 lookups per booking

500 ×100
=50,000 requests/sec
```

Read-heavy system

```
Read : Write

100 : 1
```

---

# 4. High-Level Architecture

```
                   CDN

                    │
             Load Balancer

                    │
             API Gateway

                    │
      ┌─────────────┼────────────┐
      │             │            │

 User Service   Booking Service  Calendar Service

      │             │            │

 Availability    Notification   Payment

      │             │            │

      └───────Event Bus──────────┘

               Kafka

                    │

 Email Worker
 SMS Worker
 Calendar Sync Worker
 Analytics Worker

                    │

      PostgreSQL
      Redis
      ElasticSearch
      Object Storage
```

---

# 5. Major Components

## API Gateway

Responsibilities

* Authentication
* Rate limiting
* Request routing
* Logging

---

## User Service

Stores

* User profiles
* Time zones
* Preferences

---

## Availability Service

Responsible for

* Weekly schedule
* Holidays
* Buffer rules
* Availability computation

---

## Booking Service

Handles

* Booking creation
* Cancellation
* Rescheduling
* Preventing double booking

---

## Calendar Sync Service

Responsibilities

* OAuth tokens
* Fetch busy slots
* Push events
* Receive webhooks

---

## Notification Service

Uses queue

```
Booking Created

↓

Kafka

↓

Notification Worker

↓

Email/SMS/Push
```

---

## Payment Service

Handles

* Checkout
* Webhooks
* Refunds

---

# 6. Database Design

## User

```
User
------
user_id (PK)
name
email
timezone
created_at
```

---

## Event Type

```
EventType
---------
event_type_id
user_id
title
duration
price
location
is_active
```

---

## Availability

```
Availability

availability_id
user_id
day_of_week
start_time
end_time
```

---

## Date Overrides

```
AvailabilityOverride

override_id
user_id
date
start_time
end_time
type
```

type

```
Available
Unavailable
```

---

## Calendar Connection

```
CalendarConnection

connection_id
user_id
provider
access_token
refresh_token
expires_at
```

---

## Booking

```
Booking

booking_id
event_type_id
host_user_id
guest_name
guest_email
start_time
end_time
status
meeting_url
payment_status
created_at
```

---

## Notification

```
Notification

notification_id
booking_id
channel
status
sent_at
```

---

## Payment

```
Payment

payment_id
booking_id
amount
currency
status
provider
transaction_id
```

---

# 7. ER Diagram

```
User
 |
 |1
 |
 |N
EventType
 |
 |1
 |
 |N
Booking
 |
 |1
 |
 |N
Notification

User
 |
 |1
 |
 |N
Availability

User
 |
 |1
 |
 |N
CalendarConnection

Booking
 |
 |1
 |
 |1
Payment
```

---

# 8. Booking Flow

```
Client

↓

Booking API

↓

Availability Service

↓

Redis Cache

↓

Busy?

↓

No

↓

Booking DB Transaction

↓

Publish Event

↓

Kafka

↓

Notification Service

↓

Calendar Sync

↓

Email
```

---

# 9. Preventing Double Booking

A common approach is:

1. Begin a database transaction.
2. Lock the host's availability for the requested time slot (e.g., using row-level locking or optimistic concurrency with retries).
3. Recheck for overlapping confirmed bookings.
4. Insert the booking if no conflict exists.
5. Commit the transaction.

Example overlap query:

```sql
SELECT *
FROM bookings
WHERE host_user_id = ?
  AND status = 'CONFIRMED'
  AND start_time < :requested_end
  AND end_time > :requested_start
FOR UPDATE;
```

This ensures only one concurrent transaction can successfully book the same time slot.

---

# 10. Caching Strategy

Use Redis to cache:

* User profiles
* Event types
* Weekly availability
* Frequently accessed booking pages
* Computed free time slots (with short TTLs)

Invalidate or refresh cache entries after availability updates, bookings, cancellations, or calendar synchronization events.

---

# 11. APIs

### User

```
POST /users
GET /users/{id}
PUT /users/{id}
```

### Availability

```
GET /availability
PUT /availability
POST /availability/override
```

### Event Types

```
POST /event-types
GET /event-types/{id}
```

### Booking

```
GET /availability/{eventTypeId}
POST /bookings
PUT /bookings/{id}/reschedule
DELETE /bookings/{id}
```

### Calendar

```
POST /calendar/connect
POST /calendar/webhook
```

---

# 12. Scaling Considerations

* **Stateless application servers** behind a load balancer for horizontal scaling.
* **Read replicas** for read-heavy availability queries.
* **Redis** to cache computed availability and reduce database load.
* **Message queues (e.g., Kafka)** to decouple notifications, calendar synchronization, analytics, and other asynchronous work.
* **Database partitioning/sharding** by user or tenant if the dataset grows beyond a single database's practical limits.
* **Distributed locking or transactional guarantees** to prevent double bookings across multiple application instances.
* **Background workers** for retries, webhook processing, and periodic synchronization.
* **Observability** with centralized logging, metrics, tracing, and alerting to detect failures and performance bottlenecks.

This design provides a scalable, highly available scheduling platform capable of handling millions of users while ensuring accurate availability, preventing double bookings, and integrating reliably with external calendar providers.
