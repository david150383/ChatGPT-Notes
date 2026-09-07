# MySQL TCL — Transaction Control Language

Next, let's cover **TCL**. This is especially important for interviews because it covers **transactions, COMMIT, ROLLBACK, SAVEPOINT, and ACID properties**.

---

# 1. What is TCL?

**TCL = Transaction Control Language**

TCL is used to control **transactions** in a database.

The main commands are:

```text
COMMIT
ROLLBACK
SAVEPOINT
ROLLBACK TO SAVEPOINT
RELEASE SAVEPOINT
```

### Simple definition

> A transaction is a group of SQL operations treated as a single unit of work.

For example, transferring ₹10,000 from Account A to Account B involves:

```text
1. Deduct ₹10,000 from A
2. Add ₹10,000 to B
```

Both operations should succeed together. If something fails, we should be able to roll back the transaction.

---

# 2. START TRANSACTION

Explicitly starts a transaction.

```sql id="b9z3fi"
START TRANSACTION;
```

You may also see:

```sql id="w5f7jd"
BEGIN;
```

In MySQL, `START TRANSACTION` is the clearer explicit form.

---

# 3. COMMIT ⭐⭐⭐

`COMMIT` permanently saves the changes made during the transaction.

Example:

```sql id="r7u4hl"
START TRANSACTION;

UPDATE accounts
SET balance = balance - 10000
WHERE id = 1;

UPDATE accounts
SET balance = balance + 10000
WHERE id = 2;

COMMIT;
```

After `COMMIT`, the changes are saved.

### Interview answer

> COMMIT permanently makes the changes of the current transaction visible as committed database changes.

---

# 4. ROLLBACK ⭐⭐⭐

`ROLLBACK` cancels changes made during the current transaction that have not been committed.

Example:

```sql id="1u7vfo"
START TRANSACTION;

UPDATE accounts
SET balance = balance - 10000
WHERE id = 1;

UPDATE accounts
SET balance = balance + 10000
WHERE id = 2;

ROLLBACK;
```

The changes are undone.

### Interview answer

> ROLLBACK undoes changes made by the current transaction since the last COMMIT.

---

# 5. SAVEPOINT ⭐⭐⭐

A `SAVEPOINT` creates a point inside a transaction that you can roll back to.

```sql id="w8p2hz"
START TRANSACTION;

UPDATE employees
SET salary = salary + 5000
WHERE id = 1;

SAVEPOINT sp1;

UPDATE employees
SET salary = salary + 10000
WHERE id = 2;

ROLLBACK TO SAVEPOINT sp1;

COMMIT;
```

What happens?

```text
Employee 1 update → Kept
SAVEPOINT sp1
Employee 2 update → Rolled back
COMMIT
```

So the savepoint allows you to partially undo a transaction.

---

# 6. ROLLBACK TO SAVEPOINT

Used to undo changes **after a specific savepoint**.

```sql id="g9o4ci"
ROLLBACK TO SAVEPOINT sp1;
```

Important:

It does **not** roll back the entire transaction.

The transaction remains active.

---

# 7. RELEASE SAVEPOINT

Removes a savepoint.

```sql id="4zdr0f"
RELEASE SAVEPOINT sp1;
```

The transaction continues, but that savepoint can no longer be used.

---

# 8. Complete SAVEPOINT Example

```sql id="nd7r8p"
START TRANSACTION;

UPDATE employees
SET salary = salary + 5000
WHERE id = 1;

SAVEPOINT salary_update_1;

UPDATE employees
SET salary = salary + 10000
WHERE id = 2;

SAVEPOINT salary_update_2;

UPDATE employees
SET salary = salary + 15000
WHERE id = 3;

ROLLBACK TO SAVEPOINT salary_update_2;

COMMIT;
```

Conceptually:

```text
Employee 1 update → Kept
Employee 2 update → Kept
Employee 3 update → Rolled back
COMMIT
```

---

# 9. COMMIT vs ROLLBACK ⭐⭐⭐

| Command                 | Purpose                              |
| ----------------------- | ------------------------------------ |
| `COMMIT`                | Save transaction changes             |
| `ROLLBACK`              | Undo uncommitted transaction changes |
| `SAVEPOINT`             | Create rollback point                |
| `ROLLBACK TO SAVEPOINT` | Undo changes after savepoint         |
| `RELEASE SAVEPOINT`     | Remove savepoint                     |

Easy memory:

```text
COMMIT  → SAVE
ROLLBACK → UNDO
SAVEPOINT → CHECKPOINT
```

---

# 10. Real-World Example — Bank Transfer ⭐⭐⭐

Suppose:

```text
Account A = ₹50,000
Account B = ₹20,000
```

Transfer ₹10,000 from A to B.

We need:

```sql id="0r9tqj"
START TRANSACTION;

UPDATE accounts
SET balance = balance - 10000
WHERE id = 1;

UPDATE accounts
SET balance = balance + 10000
WHERE id = 2;

COMMIT;
```

Final:

```text
Account A = ₹40,000
Account B = ₹30,000
```

But suppose the second update fails.

We should do:

```sql id="9d5g7x"
ROLLBACK;
```

Then:

```text
Account A = ₹50,000
Account B = ₹20,000
```

This prevents money from being deducted from A without being added to B.

---

# 11. What is a Transaction? ⭐⭐⭐

A transaction is a collection of one or more SQL statements that are executed as a **single logical unit of work**.

Example:

```sql id="e9s8m5"
START TRANSACTION;

INSERT INTO orders (...);

INSERT INTO order_items (...);

UPDATE inventory
SET quantity = quantity - 1
WHERE product_id = 101;

COMMIT;
```

If something goes wrong:

```sql id="7yn6kb"
ROLLBACK;
```

---

# 12. ACID Properties ⭐⭐⭐⭐⭐

This is one of the **most important MySQL interview topics**.

ACID stands for:

```text
A → Atomicity
C → Consistency
I → Isolation
D → Durability
```

---

## A — Atomicity

> All operations in a transaction happen completely, or none of them happen.

Example:

```text
Debit A
Credit B
```

If crediting B fails, the debit from A should also be rolled back.

```text
Both succeed → COMMIT
One fails    → ROLLBACK
```

---

## C — Consistency

> A transaction should move the database from one valid state to another valid state.

Example:

If an account cannot have a negative balance because of a business/database constraint, a transaction should not leave the database violating that rule.

---

## I — Isolation

> Concurrent transactions should not improperly interfere with each other.

For example:

```text
Transaction A
Transaction B
```

If both access the same data simultaneously, MySQL's transaction isolation mechanisms determine what each transaction can see.

---

## D — Durability

> Once a transaction is committed, its changes should survive failures such as a server restart, subject to the storage engine and durability configuration.

Example:

```sql id="bdv4s4"
COMMIT;
```

After a successful commit, the changes are intended to persist.

---

# 13. ACID Interview Example

Suppose:

```text
A = ₹10,000
B = ₹5,000
```

Transfer ₹2,000:

```text
A → -₹2,000
B → +₹2,000
```

### Atomicity

Both happen or neither happens.

### Consistency

Database remains valid.

### Isolation

Other transactions shouldn't see an inappropriate intermediate state.

### Durability

After commit, the successful transfer remains persisted.

---

# 14. Transaction Isolation Levels ⭐⭐⭐⭐⭐

MySQL/InnoDB supports four standard isolation levels:

```text
READ UNCOMMITTED
READ COMMITTED
REPEATABLE READ
SERIALIZABLE
```

The default isolation level for MySQL's InnoDB engine is **REPEATABLE READ**.

---

# 15. READ UNCOMMITTED

Lowest isolation level.

A transaction may read data that another transaction has modified but not committed.

This can cause:

### Dirty Read

Example:

```text
Transaction A:
UPDATE salary = 100000

Transaction B:
Reads salary = 100000

Transaction A:
ROLLBACK
```

Transaction B read a value that was never committed.

```text
Dirty Read → Reading uncommitted data
```

---

# 16. READ COMMITTED

A transaction can only read committed data.

This prevents dirty reads.

However, the same query executed twice within the transaction may see different committed data if another transaction commits changes between the reads.

This is called:

```text
Non-repeatable read
```

---

# 17. REPEATABLE READ ⭐⭐⭐

MySQL/InnoDB's default isolation level.

It provides consistent reads within a transaction under its MVCC behavior.

A transaction can generally keep seeing the same snapshot for consistent reads even if other transactions commit changes afterward.

---

# 18. SERIALIZABLE

Highest standard isolation level.

Transactions behave more like they are executed one after another.

It provides the strongest isolation but can reduce concurrency and increase locking/contention.

---

# 19. Isolation Level Comparison

| Isolation Level  | Dirty Read |     Non-repeatable Read |                                                                Phantom Read* |
| ---------------- | ---------: | ----------------------: | ---------------------------------------------------------------------------: |
| READ UNCOMMITTED |   Possible |                Possible |                                                                     Possible |
| READ COMMITTED   |         No |                Possible |                                                                     Possible |
| REPEATABLE READ  |         No | No for consistent reads | MySQL/InnoDB handles many phantom scenarios with its locking/MVCC mechanisms |
| SERIALIZABLE     |         No |                      No |                                                                           No |

*The exact behavior depends on the storage engine and type of read; interview answers often simplify this table, so it's worth remembering the MySQL/InnoDB nuance.

---

# 20. Dirty Read vs Non-Repeatable Read vs Phantom Read ⭐⭐⭐⭐

### Dirty Read

Reading **uncommitted** data.

```text
A changes data
B reads it
A rolls back
```

B read invalid/uncommitted data.

---

### Non-Repeatable Read

Reading the **same row twice** and getting different committed values.

```text
Transaction A → Reads salary = 50,000

Transaction B → Updates salary = 60,000
Transaction B → COMMIT

Transaction A → Reads again → 60,000
```

Same row, different value.

---

### Phantom Read

Running a query again and seeing **new/deleted rows** matching the condition.

Example:

```text
First query:
salary > 50000
→ 10 rows

Another transaction inserts a matching employee and commits.

Second query:
salary > 50000
→ 11 rows
```

The additional row is a "phantom."

---

# 21. AUTOCOMMIT ⭐⭐⭐

MySQL normally operates with `autocommit` enabled by default.

Check:

```sql id="d1cbr8"
SELECT @@autocommit;
```

Typically:

```text
1 → enabled
0 → disabled
```

With autocommit enabled, individual statements are committed automatically when they complete successfully.

You can disable it:

```sql id="9a1n4d"
SET autocommit = 0;
```

Then you can explicitly control commits:

```sql id="9b9v3f"
START TRANSACTION;

UPDATE employees
SET salary = salary + 5000
WHERE id = 1;

COMMIT;
```

---

# 22. Important Interview Question: Does SELECT Need COMMIT?

Normally, a simple `SELECT` does not require `COMMIT` in the way a data-changing transaction does.

However, a `SELECT` can participate in a transaction and transaction isolation affects what data it sees.

---

# 23. Important Interview Question: What Happens After COMMIT?

After:

```sql id="1j8k4f"
COMMIT;
```

The transaction's changes are committed.

You cannot use:

```sql id="k21q4w"
ROLLBACK;
```

to undo those already committed changes.

---

# 24. Important Interview Question: Can ROLLBACK Undo DDL?

Be careful here.

In MySQL, many DDL statements cause **implicit commits**, so you should not treat DDL like ordinary transactional DML.

For example:

```sql id="6u3j5r"
START TRANSACTION;

UPDATE employees
SET salary = salary + 1000;

ALTER TABLE employees
ADD age INT;

ROLLBACK;
```

You should **not assume** the `ROLLBACK` will undo everything as one atomic transaction.

### Interview answer

> MySQL DDL statements can cause implicit commits, so transactional rollback behavior differs from ordinary DML.

---

# 25. InnoDB and Transactions ⭐⭐⭐

For MySQL interviews, remember:

> **InnoDB supports transactions, row-level locking, foreign keys, and ACID properties.**

Example:

```sql id="9y0zid"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100)
) ENGINE = InnoDB;
```

If asked:

### "Which MySQL storage engine is commonly used for transactional applications?"

Answer:

> **InnoDB.**

---

# ⭐ TCL Quick Revision

```text id="z7h9x2"
START TRANSACTION
→ Start transaction

COMMIT
→ Save changes

ROLLBACK
→ Undo uncommitted changes

SAVEPOINT
→ Create checkpoint

ROLLBACK TO SAVEPOINT
→ Undo changes after checkpoint

RELEASE SAVEPOINT
→ Remove checkpoint
```

### ACID

```text id="9sl5c4"
A → Atomicity    → All or nothing
C → Consistency  → Valid state → valid state
I → Isolation    → Transactions don't improperly interfere
D → Durability   → Committed data persists
```

### Isolation levels

```text id="1qj0yk"
READ UNCOMMITTED
        ↓
READ COMMITTED
        ↓
REPEATABLE READ  ← MySQL/InnoDB default
        ↓
SERIALIZABLE
```

### ⭐ Most important TCL interview questions

1. What is a transaction?
2. What is `COMMIT`?
3. What is `ROLLBACK`?
4. What is `SAVEPOINT`?
5. What are ACID properties?
6. What are transaction isolation levels?
7. What is a dirty read?
8. What is a non-repeatable read?
9. What is a phantom read?
10. What is MySQL's default InnoDB isolation level?
11. What is autocommit?
12. What happens when DDL is executed inside a transaction?
13. Which MySQL engine supports transactions?
14. `COMMIT` vs `ROLLBACK`
15. `DELETE` vs `TRUNCATE` in relation to transactions
