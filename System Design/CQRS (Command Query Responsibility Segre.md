CQRS (Command Query Responsibility Segregation) and Event Sourcing are two architectural patterns that are often used together, but they solve different problems. You can use one without the other.

1. CQRS (Command Query Responsibility Segregation)

CQRS separates writes (commands) from reads (queries).

Instead of one model doing everything:

          Application
               |
        +--------------+
        |   Database   |
        +--------------+
          ↑        ↑
      Reads      Writes


CQRS separates them:

                Application
                 /       \
          Commands      Queries
             |             |
      Write Model     Read Model
             |             |
      Write Database  Read Database

Commands

Commands change state.

Examples:

Create Order
Update Customer
Delete Product
Transfer Money

A command answers only one question:

"Can this operation happen?"

It does not return business data.

Example:

POST /orders


Command:

CreateOrder


Response:

200 OK

Queries

Queries only read data.

Examples:

GET /orders/15
GET /customers
GET /sales-report


Queries never modify anything.

Traditional CRUD
User
   |
   v
Controller
   |
   v
Service
   |
   v
Database


Same model handles:

Insert
Update
Delete
Read
CQRS
CreateOrderCommand
        |
        v
Command Handler
        |
        v
Write DB

------------------------

GetOrderQuery
       |
       v
Query Handler
       |
       v
Read DB


Notice the separation.

Why use CQRS?

Imagine an e-commerce site.

Writing

When someone buys something:

Validate inventory
Calculate discounts
Reserve stock
Create payment
Publish notifications

Lots of business logic.

Reading an order:

SELECT * FROM Orders


Very simple.

Having the same model for both creates complexity.

CQRS separates them.

Example

Without CQRS:

OrderService

createOrder()

cancelOrder()

updateOrder()

getOrder()

getOrders()

searchOrders()

report()


Huge service.

With CQRS:

CreateOrderHandler

CancelOrderHandler

GetOrderHandler

SearchOrdersHandler

SalesReportHandler


Each has one responsibility.

Advantages
Easier to scale reads independently
Better organization
Simpler business logic
Read models optimized for UI
Easier testing
Disadvantages
More code
More infrastructure
Eventual consistency (often)
More difficult debugging
2. Event Sourcing

Instead of storing the current state, store every change that happened.

Traditional database:

Account

ID     Balance

1      2500


You know only the latest balance.

With Event Sourcing:

AccountCreated

MoneyDeposited 1000

MoneyDeposited 2000

MoneyWithdrawn 500

MoneyDeposited 1000


Nothing is overwritten.

The balance is calculated by replaying events.

0

+1000

+2000

-500

+1000

------

3500


Current state is derived from the event history.

Example

Customer changes address.

Traditional:

Customer

Address = Delhi


Later:

Address = Mumbai


Old address is lost.

Event sourcing:

CustomerCreated

AddressChanged(Delhi)

AddressChanged(Mumbai)


Complete history is preserved.

Events

Events represent something that already happened.

Examples:

OrderCreated

PaymentReceived

ItemAdded

OrderCancelled

InvoiceGenerated


Notice the past tense.

Commands are requests:

PlaceOrder


Events are facts:

OrderPlaced

Event Store

Instead of tables:

Orders
Customers
Products


Store:

Event Store

Event 1

Event 2

Event 3

Event 4


Example:

[
 OrderCreated,

 ItemAdded,

 ItemAdded,

 CouponApplied,

 PaymentCompleted
]

Rebuilding State

Suppose your Order object is lost.

Replay:

OrderCreated

↓

ItemAdded

↓

ItemAdded

↓

CouponApplied

↓

PaymentCompleted


The order is rebuilt.

Why Event Sourcing?

Benefits include:

Full audit trail
Time travel ("What did the state look like yesterday?")
Easy debugging
Supports replaying events
Enables integrations through event publication
Problems

If there are millions of events:

Replay all events

↓

Slow


Solution:

Snapshots

Events 1-100000

↓

Snapshot

↓

Events 100001-100020


Load the snapshot, then replay only the newer events.

CQRS + Event Sourcing Together

They complement each other well.

User

   |

Command

   |

Command Handler

   |

Validate Business Rules

   |

Generate Event

   |

Event Store

   |

Replay Events

   |

Read Model

   |

Query

   |

User


Example:

Command:

PlaceOrder

↓

Event:

OrderPlaced

↓

Projection

↓

OrdersReadModel

↓

Query

GetOrder


The write side stores events, while the read side maintains optimized views (called projections) built from those events.

Real-world Example

Imagine an online banking system.

Commands

DepositMoney

WithdrawMoney

TransferMoney


These validate business rules and emit events.

Events

MoneyDeposited

MoneyWithdrawn

MoneyTransferred


These are stored permanently.

Read Model

A projection updates a table like:

Account

ID      Balance

1       15,200


When a user opens the app, the balance is read from this projection instead of replaying every event. If the projection is lost or needs to be changed, it can be rebuilt from the event store.

When to Use CQRS and Event Sourcing
Scenario	CQRS	Event Sourcing
Simple CRUD application	Usually no	No
Inventory management	Sometimes	Sometimes
Banking	Yes	Yes
Payment systems	Yes	Yes
Financial ledgers	Yes	Yes
Booking systems	Often	Often
High-scale e-commerce	Often	Sometimes
Audit-heavy systems	Sometimes	Yes
Key Differences
CQRS	Event Sourcing
Separates reads from writes	Stores every state change as an event
Architectural pattern	Data persistence pattern
Focuses on scalability and maintainability	Focuses on history, auditability, and replayability
Can use normal databases	Uses an event store as the source of truth
Can be used independently	Can be used independently

A useful way to think about them is:

CQRS answers: How should we organize reads and writes?
Event Sourcing answers: How should we persist changes over time?

They are frequently combined because events produced on the write side can naturally drive the read-side projections, but many successful systems use only CQRS or only Event Sourcing, depending on their requirements.