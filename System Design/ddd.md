# Domain-Driven Design (DDD): Tactical Patterns

This phrase commonly appears in senior backend and software engineering
job descriptions:

> Practical experience applying Domain-Driven Design (DDD) tactical
> patterns, including aggregates, repositories, and domain events.

It means you have applied DDD concepts in real production systems---not
just studied the terminology.

## 1. What Is Domain-Driven Design?

**Domain-Driven Design (DDD)** is a software design approach introduced
by Eric Evans. It puts the business domain at the center of software
design.

Rather than organizing an application primarily around database tables
or frameworks, DDD encourages you to model the software around business
concepts and rules.

For example, in an e-commerce system, important domain concepts might
include:

-   Customer
-   Order
-   Payment
-   Inventory
-   Shipment

These concepts become important building blocks of the application.

## 2. Strategic Design vs. Tactical Design

DDD has two broad areas:

-   **Strategic design** focuses on the structure of a large system.
    Concepts include bounded contexts and context maps.
-   **Tactical design** focuses on how the domain model is implemented
    inside a bounded context.

The job-description phrase specifically calls out tactical patterns.

Common DDD tactical patterns include:

-   Entities
-   Value Objects
-   Aggregates
-   Repositories
-   Domain Services
-   Domain Events

The three patterns highlighted in the phrase are aggregates,
repositories, and domain events.

## 3. Aggregates

An **Aggregate** is a cluster of related domain objects that are treated
as a consistency boundary. One object is designated as the **Aggregate
Root**.

For example:

``` text
Order
 ├── OrderItem
 ├── ShippingAddress
 └── PaymentDetails
```

In this example, `Order` is the Aggregate Root.

Code outside the aggregate should make changes through the root rather
than modifying child objects directly.

``` java
order.addItem(product, 2);
```

Instead of:

``` java
orderItem.setQuantity(2);
```

### Why use aggregates?

The Aggregate Root protects business rules and controls valid state
changes.

For example, an order might enforce rules such as:

-   Items cannot be added after the order has shipped.
-   Item quantity must be positive.
-   The order must contain at least one item before it can be placed.
-   The order total must not exceed an allowed limit.

The aggregate keeps these rules close to the state they protect.

> **Important:** An aggregate is also a transaction boundary in the
> domain model. Keep aggregates focused and avoid putting an entire
> business workflow into one oversized aggregate.

## 4. Repositories

A **Repository** provides an abstraction for retrieving and persisting
domain objects. It keeps persistence details out of the domain model.

Without a repository abstraction, application or domain code may become
coupled to database-specific operations:

``` sql
SELECT * FROM orders WHERE id = ?;
```

Or to a persistence framework:

``` java
entityManager.find(Order.class, orderId);
```

With a repository, application code can work with domain-oriented
operations:

``` java
Order order = orderRepository.findById(orderId);

orderRepository.save(order);
```

The repository implementation handles the persistence details.

The underlying storage could be:

-   PostgreSQL
-   MongoDB
-   DynamoDB
-   Another persistence technology

### Why use repositories?

-   They separate domain logic from persistence concerns.
-   They make application code easier to test.
-   They provide a domain-oriented way to load and save aggregates.
-   They allow persistence implementations to change without redesigning
    the domain model.

A common approach is to define a repository interface near the domain
model and implement it in the infrastructure layer.

## 5. Domain Events

A **Domain Event** represents something meaningful that has happened in
the business domain.

Examples include:

-   `OrderPlaced`
-   `PaymentReceived`
-   `CustomerRegistered`
-   `ProductOutOfStock`

After an important business action occurs, the application can publish
an event. Other components can react to it without the original
component needing to know their implementation details.

For example, instead of directly coordinating every dependent operation:

``` javascript
await paymentService.pay();
await inventoryService.update();
await emailService.send();
await analyticsService.track();
```

The order workflow can publish an event:

``` javascript
await eventPublisher.publish({
  type: "OrderPlaced",
  orderId: order.id
});
```

Other components can subscribe to that event:

``` text
                 Order Service
                       |
                       | publishes
                       v
                  OrderPlaced
                       |
          +------------+------------+
          |            |            |
          v            v            v
     Inventory      Email       Analytics
       Service      Service       Service
```

### Why use domain events?

-   They reduce direct dependencies between components.
-   They make it easier to add new reactions to business events.
-   They support asynchronous workflows.
-   They help separate the action that happened from the systems that
    respond to it.

**Domain event vs. integration event:** A domain event describes
something meaningful within a domain model. An integration event
communicates a committed business fact to other services or bounded
contexts. They are related, but not necessarily the same event or
message.

For reliable event delivery in production, consider the **Transactional
Outbox Pattern**. It stores the business change and the event record in
the same database transaction; a separate publisher then delivers the
event to the message broker.

## 6. Putting the Patterns Together: An E-Commerce Example

Consider an online shopping application.

### Step 1: Create the order

A customer places an order:

``` java
Order order = Order.create(customerId);
```

### Step 2: Let the aggregate enforce business rules

The `Order` aggregate checks conditions such as:

-   Does the order contain items?
-   Is the order in a state that allows placement?
-   Are the item quantities valid?
-   Are the relevant business constraints satisfied?

If validation succeeds, the order transitions to the placed state.

### Step 3: Persist the aggregate

The application saves the order through its repository:

``` java
orderRepository.save(order);
```

### Step 4: Record or publish the domain event

The successful business operation produces an event such as:

``` text
OrderPlaced
```

In a production system, the event should be recorded reliably as part of
the transaction, for example through an outbox.

### Step 5: Let other components react

Other components or services can respond:

-   Inventory is reserved or reduced.
-   A confirmation email is sent.
-   Reward points are calculated.
-   An invoice is generated.
-   Shipping is initiated.

The Order service does not need to know the internal implementation of
every downstream action.

## 7. What Does "Practical Experience" Mean?

Interviewers generally want evidence that you have applied these
patterns to real business problems.

Examples include:

1.  **Designed aggregates** to enforce business rules and protect
    consistency.
2.  **Created repository interfaces** and implemented them using a
    persistence technology such as JPA/Hibernate, Prisma, TypeORM, or a
    custom data-access layer.
3.  **Published and consumed domain or integration events** using an
    in-process event mechanism or a message broker such as RabbitMQ or
    Kafka.
4.  **Prevented invalid state changes** by encapsulating business logic
    in domain objects instead of scattering it across controllers and
    services.
5.  **Designed domain models around business concepts** rather than
    simply mirroring database tables.
6.  **Handled reliable event publication** so a committed business
    change does not silently lose its corresponding event.

The important point is not merely that you used a message broker or an
ORM. It is that you made deliberate design decisions to protect business
rules, manage persistence boundaries, and coordinate business workflows.

## 8. Example Interview Answer

If you have applied these ideas in a Spring Boot project, you could
explain your experience like this:

> In one of my projects, we modeled `Order` as an aggregate root. All
> modifications to order items went through the `Order` aggregate so
> that business rules were enforced in one place. We used repository
> interfaces backed by Spring Data JPA to load and persist orders. After
> an order was successfully placed, we recorded an `OrderPlaced` event
> and handled the resulting work asynchronously---for example, updating
> inventory and sending confirmation notifications. This kept the order
> domain focused and reduced direct coupling to downstream processes.

Adapt this answer to match what you have actually built. Do not claim to
have used a pattern or technology that you have not used.

## 9. One-Sentence Summary

The phrase **"Practical experience applying DDD tactical patterns,
including aggregates, repositories, and domain events"** means you have
hands-on experience designing business-focused software where:

-   **Aggregates** protect business rules and maintain consistency
    within a defined boundary.
-   **Repositories** provide a domain-oriented abstraction for loading
    and saving domain objects.
-   **Domain Events** represent important business occurrences and allow
    other parts of the system to react with reduced coupling.

## 10. Quick Interview Revision

  -----------------------------------------------------------------------
  Pattern                 Main responsibility     Key question
  ----------------------- ----------------------- -----------------------
  Aggregate               Protects consistency    Who is allowed to
                          and business rules      change this state?

  Aggregate Root          Controls access to the  What is the entry point
                          aggregate               for changes?

  Repository              Loads and persists      How does the
                          aggregates              application retrieve
                                                  and save domain
                                                  objects?

  Domain Event            Records a meaningful    What happened that
                          business occurrence     other components may
                                                  care about?

  Transactional Outbox    Supports reliable event How do we avoid
                          publication             committing data but
                                                  losing its event?
  -----------------------------------------------------------------------

------------------------------------------------------------------------

**Practical takeaway:** DDD is not about adding more classes or
patterns. It is about making business rules explicit, protecting valid
state transitions, and designing clear boundaries between parts of a
system.
