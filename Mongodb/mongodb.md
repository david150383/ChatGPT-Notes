Absolutely. For **8 years of MongoDB experience**, you should practice more than basic find() queries. You want a dataset that lets you cover:

* CRUD
* Query operators
* Arrays and embedded documents
* Projection
* Sorting, pagination
* Indexes and explain()
* Aggregation pipeline
* $lookup
* $unwind
* $group
* $facet
* $bucket
* $setWindowFields
* Transactions
* Schema design
* Performance tuning
* Replication/sharding concepts
* Real interview-style debugging
### 1. Practice database

I recommend building a realistic **e-commerce database** with:
```text
ecommerce
├── users
├── products
├── orders
├── reviews
└── payments
```

This gives you enough relationships and nested data to practice almost everything.

### 2. Importable dataset

I can give you a complete dataset containing roughly:
```text
users       → 1,000 documents
products    → 500 documents
orders      → 5,000 documents
reviews     → 2,000 documents
payments    → 5,000 documents
```

For shell practice, I'd make it available as separate JSON files:
```text
mongodb-practice/
├── users.json
├── products.json
├── orders.json
├── reviews.json
└── payments.json
```

Then you can import them with:
```text
mongoimport --db ecommerce --collection users --file users.json --jsonArray
mongoimport --db ecommerce --collection products --file products.json --jsonArray
mongoimport --db ecommerce --collection orders --file orders.json --jsonArray
mongoimport --db ecommerce --collection reviews --file reviews.json --jsonArray
mongoimport --db ecommerce --collection payments --file payments.json --jsonArray
```

If you're using mongosh, you'll then work with:
```text
use ecommerce
```
### 3. Your 8-year MongoDB interview practice roadmap
#### Level 1 — 0–2 years

Start with these.

#### CRUD
```text
db.users.find()

db.users.find({ age: { $gt: 30 } })

db.users.insertOne({
    name: "John",
    age: 30,
    email: "john@test.com"
})

db.users.updateOne(
    { email: "john@test.com" },
    { $set: { age: 31 } }
)

db.users.deleteOne({
    email: "john@test.com"
})
```

Practice:

1. Find all users from India.
1. Find users older than 30.
1. Find users between 25 and 40.
1. Find users whose status is "active".
1. Find users who registered after a particular date.
1. Update one user's phone number.
1. Increase all product prices by 10%.
1. Delete inactive users.
1. Find users whose email contains "gmail".
1. Return only name and email.
## Level 2 — 2–3 years
#### Arrays and nested documents

Example:
```text
{
    name: "Laptop",
    category: "Electronics",
    price: 85000,
    tags: ["computer", "gaming", "electronics"],
    specifications: {
        ram: 16,
        storage: 512,
        processor: "i7"
    }
}
```

Practice:
```text
db.products.find({
    tags: "gaming"
})
```
```text
db.products.find({
    "specifications.ram": { $gte: 16 }
})
```

Questions:

1. Find products containing "gaming".
1. Find products having RAM >= 16 GB.
1. Find products with storage >= 512 GB.
1. Find products containing both "computer" and "gaming".
1. Find products with at least 3 tags.
1. Find users having more than 2 addresses.
1. Find orders containing a particular product.
1. Find users whose city is Hyderabad.
## Level 3 — 3–4 years
#### Aggregation

This is where interview questions become much more serious.

#### Question 1

Find total revenue.
```text
db.orders.aggregate([
    {
        $group: {
            _id: null,
            totalRevenue: {
                $sum: "$totalAmount"
            }
        }
    }
])
```
#### Question 2

Find revenue by month.
```text
db.orders.aggregate([
    {
        $group: {
            _id: {
                year: { $year: "$orderDate" },
                month: { $month: "$orderDate" }
            },
            revenue: {
                $sum: "$totalAmount"
            }
        }
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1
        }
    }
])
```
#### Question 3

Top 10 customers by spending.
```text
db.orders.aggregate([
    {
        $group: {
            _id: "$userId",
            totalSpent: {
                $sum: "$totalAmount"
            }
        }
    },
    {
        $sort: {
            totalSpent: -1
        }
    },
    {
        $limit: 10
    }
])
```
#### Practice yourself
1. Find the top 10 products by sales.
1. Find average order value.
1. Find revenue by category.
1. Find number of orders per customer.
1. Find the most expensive order.
1. Find the cheapest order.
1. Find the average product price by category.
1. Find customers who spent more than ₹1 lakh.
1. Find monthly order counts.
1. Find the month with the highest revenue.
## Level 4 — 4–5 years
$lookup

You should be very comfortable with this in interviews.

Find order details along with customer information:
```text
db.orders.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "customer"
        }
    },
    {
        $unwind: "$customer"
    }
])

```

Practice:

1. Orders with customer name.
1. Orders with customer email.
1. Customers and their orders.
1. Customers who have never placed an order.
1. Products and their reviews.
1. Top customers with their order details.
1. Find customers who bought products from "Electronics".
1. Find products never ordered.

## Level 5 — 5–6 years

#### Advanced aggregation

Practice:

$facet

Build a single query returning:
```text
total products
average price
cheapest product
most expensive product
products by category
```
$bucket

Group products:
```text
0–10,000
10,000–25,000
25,000–50,000
50,000+
```
$unwind

Practice orders containing:
```text
items: [
    {
        productId: ...,
        quantity: 2,
        price: 50000
    }
]
```

Questions:

1. Find total quantity sold for every product.
1. Find revenue generated by every product.
1. Find the most frequently purchased product.
1. Find average quantity per order.
1. Find customers who bought more than 10 different products.
## Level 6 — 6–7 years
#### Indexing and performance

This is extremely important for senior interviews.

Create indexes:
```text
db.users.createIndex({ email: 1 })

db.orders.createIndex({ userId: 1 })

db.orders.createIndex({ orderDate: -1 })

db.products.createIndex({
    category: 1,
    price: 1
})
```

Then investigate queries with:
```text
db.orders.find({
    userId: ObjectId("...")
}).explain("executionStats")
```

Understand:
```text
COLLSCAN
IXSCAN
FETCH
keysExamined
docsExamined
executionTimeMillis
```

Interview questions:

1. Why is MongoDB doing a collection scan?
1. Which index would you create?
1. Why isn't MongoDB using your index?
1. Compound index vs single-field index?
1. What is index selectivity?
1. What is a covered query?
1. What happens if you create too many indexes?
1. Explain ESR — Equality, Sort, Range.
1. How would you optimize a slow aggregation?
1. How would you investigate a production MongoDB performance issue?
## Level 7 — 7–8 years

Now practice **senior/staff-level questions.**

#### Schema design

Given:
```text
User
 ├── Orders
 │    └── Products
 │
 └── Addresses
```

Decide:
```text
embed
vs
reference
```

Be able to explain **why.**

Questions:

1. When would you embed documents?
1. When would you reference documents?
1. What is the MongoDB 16 MB document limit?
1. How do you model one-to-many relationships?
1. How do you model many-to-many relationships?
1. How would you design an order schema?
1. How would you design a social-media feed?
1. How would you design a messaging system?
1. How would you store product reviews?
1. How would you prevent unbounded arrays?
## Level 8 — Production-level interviews

You should also be able to explain:

#### Transactions
```text
const session = db.getMongo().startSession()

session.startTransaction()

// operations

session.commitTransaction()
session.endSession()
```

Know:

* ACID
* read concern
* write concern
* transaction limitations
* when transactions are appropriate
* why MongoDB doesn't mean "everything should be transactional"
#### Replication

Understand:
```text
Primary
   |
   ├── Secondary
   └── Secondary
```

Questions:

* What happens when primary goes down?
* How does election work?
* What is an oplog?
* What is read preference?
* What is write concern?
* What is w: "majority"?
* Can you read from secondaries?
* What is replication lag?
#### Sharding

Understand:
```text
Application
     |
mongos
     |
-------------------------
|          |            |
Shard 1    Shard 2      Shard 3
```

Practice explaining:

* shard key
* chunks
* balancer
* mongos
* config servers
* hashed sharding
* ranged sharding
* hotspotting
* poor shard-key selection
* cardinality
* query targeting
* scatter-gather queries
Your interview challenge

Once you have the dataset, don't just run queries from tutorials.

I'll recommend doing **100 interview questions** in this order:
```text
01–15   CRUD
16–25   Query operators
26–35   Arrays / nested documents
36–55   Aggregation
56–65   $lookup / $unwind
66–75   Indexes / explain
76–85   Schema design
86–92   Transactions
93–96   Replication
97–100  Sharding / production scenarios
```

For each question, try to solve it **without looking at the answer**.

Then compare your solution against an optimized solution and ask yourself:

"Would this query work efficiently on 100 million documents?"

That's the mindset that separates basic MongoDB knowledge from **senior-level interview preparation**.

#### Generate large dataset


#### Run it
```text
node generate-mongodb-data.js
```

You'll get:
```text
mongodb-practice-data/
├── users.json
├── products.json
├── orders.json
├── reviews.json
└── payments.json
```

Then import:
```text
mongoimport --db ecommerce --collection users --file mongodb-practice-data/users.json --jsonArray
mongoimport --db ecommerce --collection products --file mongodb-practice-data/products.json --jsonArray
mongoimport --db ecommerce --collection orders --file mongodb-practice-data/orders.json --jsonArray
mongoimport --db ecommerce --collection reviews --file mongodb-practice-data/reviews.json --jsonArray
mongoimport --db ecommerce --collection payments --file mongodb-practice-data/payments.json --jsonArray
```

Then verify in mongosh:
```text
use ecommerce
db.users.countDocuments()
db.products.countDocuments()
db.orders.countDocuments()
db.reviews.countDocuments()
db.payments.countDocuments()
```

You should get:
```text
10000
2000
50000
20000
50000
```

This dataset is also deliberately suitable for practicing the **100 interview questions** above, especially the $lookup, $unwind, aggregation, compound-index, and explain("executionStats") questions.