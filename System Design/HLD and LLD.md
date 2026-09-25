**HLD (High-Level Design)** and **LLD (Low-Level Design)** are two important stages of software system design. They complement each other:

* **HLD** focuses on the **overall architecture** and how major components interact.
* **LLD** focuses on the **internal implementation** of each component.

Think of building a house:

* **HLD** = the blueprint showing rooms, floors, plumbing, and electrical layout.
* **LLD** = the detailed drawings showing the exact dimensions, wiring, pipe sizes, and construction details.

---

# Comparison: HLD vs LLD

| Aspect       | High-Level Design (HLD)              | Low-Level Design (LLD)           |
| ------------ | ------------------------------------ | -------------------------------- |
| Focus        | Overall system architecture          | Internal implementation          |
| Audience     | Architects, Tech Leads, Stakeholders | Developers                       |
| Detail Level | High                                 | Very detailed                    |
| Purpose      | Define system structure              | Define code structure            |
| Output       | Architecture diagrams                | Class diagrams, APIs, algorithms |
| Technology   | Sometimes technology-independent     | Technology-specific              |
| Changes      | Easier to modify                     | Harder after implementation      |

---

# High-Level Design (HLD)

## Definition

High-Level Design describes **how the entire system is organized**.

It answers questions like:

* What are the major modules?
* How do modules communicate?
* Which database will be used?
* Should we use microservices or a monolith?
* How will scaling work?
* What are the external integrations?

It provides the **big picture**.

---

## Example

Suppose you are designing an **Online Shopping System**.

HLD may look like:

```
                Users
                  |
            Load Balancer
                  |
         ---------------------
         |         |         |
     User Service Product Service Order Service
         |         |         |
         ---------------------
                  |
             API Gateway
                  |
             Payment Service
                  |
              MySQL Database
                  |
               Redis Cache
```

Here, you are **not** discussing classes or methods.

Instead, you describe:

* User Service
* Product Service
* Order Service
* Payment Service
* Database
* Cache
* Load Balancer

---

## HLD Components

### 1. System Architecture

Examples:

* Monolithic
* Microservices
* Event-driven
* Serverless

---

### 2. Modules

Example:

```
Authentication Module

Shopping Cart Module

Order Module

Payment Module

Inventory Module
```

---

### 3. Database Choice

Examples:

* MySQL
* PostgreSQL
* MongoDB
* Cassandra

Explain why a particular database is chosen.

---

### 4. External Services

Example:

```
Stripe Payment Gateway

Email Service

SMS Gateway

Google Maps
```

---

### 5. APIs

Example:

```
Frontend

↓

REST APIs

↓

Backend
```

---

### 6. Scalability

Example:

```
Auto Scaling

Load Balancer

Caching

CDN
```

---

### 7. Security

Examples:

* JWT Authentication
* OAuth
* HTTPS
* Rate Limiting

---

### 8. Deployment

Example:

```
Docker

↓

Kubernetes

↓

AWS
```

---

# Deliverables of HLD

Typical HLD documentation includes:

* Architecture diagram
* Component diagram
* Technology stack
* Database selection
* API overview
* Scalability strategy
* Security overview
* Deployment architecture

---

# Low-Level Design (LLD)

## Definition

LLD explains **how each module will actually be implemented in code**.

It answers questions like:

* Which classes are required?
* Which methods should exist?
* What design patterns should be used?
* How will data flow inside the module?
* What algorithms are needed?
* What are the object relationships?

---

## Example

Suppose we have an **Order Service**.

HLD only says:

```
Order Service
```

LLD explains:

```
Order

- orderId
- customerId
- items
- totalPrice
- status

+ placeOrder()
+ cancelOrder()
+ calculatePrice()
```

Another class:

```
Payment

- paymentId
- amount

+ pay()
+ refund()
```

Relationship:

```
Customer

      1
      |
      |
      *
    Orders
```

This level of detail guides developers during implementation.

---

# LLD Components

### 1. Class Diagram

Example:

```
Customer

+ id
+ name

+ login()

---------------------

Product

+ id
+ price

+ updatePrice()

---------------------

Cart

+ addItem()

+ removeItem()
```

---

### 2. Database Tables

Example:

```
User Table

id
name
email

------------------

Order Table

id
user_id
status

------------------

Product Table

id
price
stock
```

---

### 3. Sequence Diagram

Example:

```
User

↓

Order API

↓

Order Service

↓

Inventory

↓

Payment

↓

Database
```

---

### 4. Algorithms

Example:

```
calculateDiscount()

calculateTax()

sortProducts()

searchProducts()
```

---

### 5. API Design

Example:

```
POST /orders

GET /orders/{id}

DELETE /orders/{id}
```

---

### 6. Exception Handling

Examples:

```
Payment Failed

↓

Rollback Inventory

↓

Notify User
```

---

### 7. Design Patterns

Common choices include:

* Singleton
* Factory
* Strategy
* Observer
* Builder
* Adapter

---

# Deliverables of LLD

Typical LLD documentation includes:

* UML class diagrams
* Sequence diagrams
* Activity diagrams
* Database schema
* API specifications
* Method signatures
* Design patterns
* Pseudocode or algorithms
* Error handling strategy

---

# Example: Login System

## HLD View

```
User

↓

Web App

↓

Authentication Service

↓

Database

↓

JWT Token

↓

User Dashboard
```

This shows the overall flow and components.

---

## LLD View

Classes:

```java
class User {
    int id;
    String email;
    String passwordHash;
}

class AuthService {
    login(email, password)
    register()
    logout()
}

class JwtUtil {
    generateToken()
    validateToken()
}
```

Methods:

```
login()

↓

validatePassword()

↓

generateJWT()

↓

return token
```

This is detailed enough for developers to implement.

---

# Example: URL Shortener

## HLD

```
User

↓

API Gateway

↓

URL Service

↓

Redis Cache

↓

Database
```

Topics covered:

* Load balancer
* Cache
* Database
* Hash generation
* Scaling strategy

---

## LLD

Classes:

```
URL

- originalUrl
- shortCode
- createdDate

ShortenerService

generateShortCode()

save()

getOriginalURL()

DatabaseRepository

insert()

findByShortCode()
```

Methods and data structures are defined in detail.

---

# Interview Perspective

For **HLD (System Design) interviews**, interviewers typically expect you to discuss:

* Functional and non-functional requirements
* System architecture
* Scalability
* Availability
* Reliability
* Caching
* Load balancing
* Database selection (SQL vs. NoSQL)
* Message queues
* Security
* Monitoring and deployment
* Trade-offs between design choices

For **LLD (Object-Oriented Design) interviews**, they often focus on:

* Class design
* Object-oriented principles (SOLID)
* Design patterns
* Interfaces and inheritance
* Relationships between classes
* Method signatures
* Exception handling
* Data structures and algorithms
* Extensibility and maintainability
* Unit testing considerations

---

# Relationship Between HLD and LLD

```
Requirements
      │
      ▼
High-Level Design (Architecture)
      │
      ▼
Modules & Components
      │
      ▼
Low-Level Design (Classes, APIs, Methods)
      │
      ▼
Implementation (Code)
      │
      ▼
Testing & Deployment
```

HLD defines **what the system consists of and how its major parts interact**, while LLD defines **how each part is built internally**. Together, they bridge the gap between requirements and implementation, ensuring the software is both architecturally sound and practical to develop.
