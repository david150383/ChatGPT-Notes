# MySQL Indexes & EXPLAIN — Part 2

This is one of the **most important MySQL interview topics**, especially for 2+ years experience.

---

# 1. What is an Index? ⭐⭐⭐⭐⭐

An **index** is a data structure that helps MySQL find rows faster without scanning the entire table.

Think of a book.

Without an index:

```text
Search for "MySQL"
→ Read every page
```

With an index:

```text
Search index
→ Find page number
→ Go directly there
```

Similarly:

```text
Without index
→ Full Table Scan

With suitable index
→ Faster row lookup
```

---

# 2. Basic Index

Create an index:

```sql
CREATE INDEX idx_email
ON users(email);
```

Now a query like:

```sql
SELECT *
FROM users
WHERE email = 'john@gmail.com';
```

can potentially use the index.

---

# 3. Why Do We Need Indexes?

Suppose you have:

```text
employees
10 million rows
```

Query:

```sql
SELECT *
FROM employees
WHERE email = 'john@gmail.com';
```

Without a suitable index, MySQL may need to inspect many/all rows.

With:

```sql
CREATE INDEX idx_email
ON employees(email);
```

MySQL can potentially locate the matching row much more efficiently.

### Interview answer

> Indexes improve read/query performance by allowing the database to locate rows more efficiently, but they consume storage and add overhead to data modifications.

---

# 4. Disadvantages of Indexes ⭐⭐⭐⭐⭐

Indexes are not always free.

### 1. Storage

Indexes consume disk/memory resources.

### 2. INSERT becomes more expensive

When you insert a row, indexes may also need to be updated.

### 3. UPDATE can become more expensive

If an indexed column changes, the index needs maintenance.

### 4. DELETE can become more expensive

Corresponding index entries need to be removed.

So:

```text
More indexes
      ↓
Potentially faster reads
      ↓
But more write/maintenance overhead
```

---

# 5. PRIMARY KEY Index ⭐⭐⭐⭐

When you define:

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);
```

MySQL/InnoDB automatically creates the index needed for the primary key.

You generally don't need:

```sql
CREATE INDEX idx_id
ON employees(id);
```

because the primary key is already indexed.

---

# 6. UNIQUE Index ⭐⭐⭐⭐

You can create a unique index:

```sql
CREATE UNIQUE INDEX idx_email
ON employees(email);
```

This provides:

```text
Indexing
+
Uniqueness enforcement
```

So duplicate emails are prevented.

---

# 7. Composite Index ⭐⭐⭐⭐⭐

An index can contain multiple columns.

```sql
CREATE INDEX idx_dept_salary
ON employees(department_id, salary);
```

This is called a **composite index** or **multi-column index**.

---

# 8. Why Column Order Matters ⭐⭐⭐⭐⭐

Consider:

```sql
CREATE INDEX idx_dept_salary
ON employees(department_id, salary);
```

The order is:

```text
department_id
      ↓
salary
```

This can efficiently support queries such as:

```sql
WHERE department_id = 10
```

and:

```sql
WHERE department_id = 10
AND salary > 50000
```

But a query only on:

```sql
WHERE salary > 50000
```

generally cannot use this composite index as efficiently because `department_id` is the first indexed column.

This leads to the **leftmost-prefix rule**.

---

# 9. Leftmost Prefix Rule ⭐⭐⭐⭐⭐

For:

```sql
CREATE INDEX idx_abc
ON employees(a, b, c);
```

The index can generally be used efficiently for:

```text
(a)
(a, b)
(a, b, c)
```

But not generally for:

```text
(b)
(c)
(b, c)
```

Think:

```text
(a, b, c)

✓ a
✓ a + b
✓ a + b + c

✗ b
✗ c
✗ b + c
```

### Interview answer

> In a composite B-tree index, the leading columns matter. Queries that don't constrain the leftmost indexed columns may not be able to use the index efficiently.

---

# 10. Example of Composite Index

Create:

```sql
CREATE INDEX idx_department_salary
ON employees(department_id, salary);
```

Good:

```sql
SELECT *
FROM employees
WHERE department_id = 10;
```

Good:

```sql
SELECT *
FROM employees
WHERE department_id = 10
AND salary > 50000;
```

Potentially less useful:

```sql
SELECT *
FROM employees
WHERE salary > 50000;
```

because `department_id` is missing.

---

# 11. Index Column Order Strategy ⭐⭐⭐⭐

Suppose most queries are:

```sql
WHERE department_id = ?
AND salary > ?
```

A reasonable index could be:

```sql
CREATE INDEX idx_dept_salary
ON employees(department_id, salary);
```

But index design should be based on actual query patterns, data distribution, and optimizer behavior—not a simplistic rule like "always put the most selective column first."

---

# 12. Index Selectivity ⭐⭐⭐⭐

**Selectivity** describes how effectively a column narrows down rows.

Example:

```text
gender:
Male
Female
```

Only a few distinct values → relatively low selectivity.

But:

```text
email:
john1@gmail.com
john2@gmail.com
john3@gmail.com
...
```

Many distinct values → high selectivity.

Generally, highly selective predicates can be useful for indexes, but the optimizer considers the complete query and statistics.

---

# 13. High vs Low Cardinality

### High cardinality

Many distinct values:

```text
email
user_id
order_id
```

### Low cardinality

Few distinct values:

```text
gender
status
is_active
```

Indexes on low-cardinality columns are not automatically useless, but their usefulness depends heavily on the data distribution and query.

---

# 14. EXPLAIN ⭐⭐⭐⭐⭐

One of the most important commands for query optimization.

Use:

```sql
EXPLAIN
SELECT *
FROM employees
WHERE email = 'john@gmail.com';
```

It tells you how MySQL plans to execute the query.

---

# 15. EXPLAIN Example

```sql
EXPLAIN
SELECT *
FROM employees
WHERE department_id = 10;
```

You'll see information such as:

```text
id
select_type
table
partitions
type
possible_keys
key
key_len
ref
rows
filtered
Extra
```

You don't need to memorize every field immediately. Focus on the important ones.

---

# 16. EXPLAIN — Important Columns ⭐⭐⭐⭐⭐

## type

Shows the access method.

Common values include:

```text
const
eq_ref
ref
range
index
ALL
```

Generally, `ALL` means a full table scan and is often a warning for large tables, though context matters.

---

# 17. type = ALL

Example:

```text
type: ALL
```

Usually means:

```text
Full Table Scan
```

MySQL may inspect many/all rows.

Example:

```sql
SELECT *
FROM employees
WHERE name LIKE '%john%';
```

A normal B-tree index on `name` generally cannot efficiently search for an arbitrary substring beginning with `%`.

---

# 18. type = const

Used when MySQL can determine at most one matching row through a constant lookup on a primary/unique key.

Example:

```sql
SELECT *
FROM employees
WHERE id = 10;
```

If `id` is the primary key, the optimizer can often use a `const` access type.

---

# 19. type = ref

Often seen when a non-unique index is used for equality matching.

Example:

```sql
SELECT *
FROM employees
WHERE department_id = 10;
```

If `department_id` has a suitable non-unique index, `ref` may appear.

---

# 20. type = range

Used when MySQL accesses a range of index values.

Example:

```sql
SELECT *
FROM employees
WHERE salary BETWEEN 50000 AND 80000;
```

Or:

```sql
WHERE salary > 50000
```

You may see:

```text
type: range
```

---

# 21. possible_keys

Shows indexes MySQL considers potentially usable.

Example:

```text
possible_keys:
idx_email
```

This doesn't mean MySQL will actually use the index.

---

# 22. key ⭐⭐⭐⭐⭐

Shows the index MySQL actually chose.

Example:

```text
possible_keys: idx_email
key:           idx_email
```

If:

```text
key: NULL
```

MySQL didn't choose an index for that table access.

---

# 23. rows ⭐⭐⭐⭐⭐

`rows` is an estimate of how many rows MySQL expects to examine.

Example:

```text
rows: 1000000
```

versus:

```text
rows: 10
```

A huge estimated row count can indicate an expensive access path, although you must interpret it in the context of the whole plan.

---

# 24. Extra ⭐⭐⭐⭐⭐

`Extra` can contain useful information.

Examples:

```text
Using index
Using where
Using temporary
Using filesort
```

---

# 25. Using index

This can indicate a **covering index** situation where MySQL can obtain the needed columns from the index without having to fetch the full row from the table.

Example:

```sql
CREATE INDEX idx_dept_name
ON employees(department_id, name);
```

Query:

```sql
SELECT department_id, name
FROM employees
WHERE department_id = 10;
```

The index contains the columns needed by the query.

---

# 26. Covering Index ⭐⭐⭐⭐⭐

A covering index contains all columns needed for a particular query.

Example:

```sql
CREATE INDEX idx_dept_name_salary
ON employees(department_id, name, salary);
```

Query:

```sql
SELECT name, salary
FROM employees
WHERE department_id = 10;
```

The index contains:

```text
department_id
name
salary
```

So MySQL may be able to answer the query directly from the index.

---

# 27. Using filesort

You may see:

```text
Extra: Using filesort
```

This means MySQL needs an additional sorting operation.

Example:

```sql
SELECT *
FROM employees
ORDER BY salary DESC;
```

If there isn't an appropriate access path/index, MySQL may need to sort the result.

### Important

`Using filesort` does **not necessarily mean disk-based sorting**. It is a MySQL execution-plan term for an additional sorting method.

---

# 28. Using temporary

You may see:

```text
Extra: Using temporary
```

MySQL needs a temporary structure for part of the query.

This can occur with certain:

```text
GROUP BY
ORDER BY
DISTINCT
```

queries.

It isn't automatically bad, but for large datasets it may deserve investigation.

---

# 29. Why Index May Not Be Used ⭐⭐⭐⭐⭐

Several reasons are possible.

### 1. Function on indexed column

```sql
WHERE YEAR(join_date) = 2026
```

A normal index on `join_date` may not be used efficiently.

Often better:

```sql
WHERE join_date >= '2026-01-01'
AND join_date < '2027-01-01'
```

---

### 2. Leading wildcard

```sql
WHERE name LIKE '%john%'
```

A normal B-tree index generally cannot efficiently seek to an arbitrary substring.

But:

```sql
WHERE name LIKE 'john%'
```

can potentially use an appropriate index.

---

### 3. Wrong composite-index column

Index:

```sql
INDEX(a, b)
```

Query:

```sql
WHERE b = 10
```

The index may not be useful in the same way as when `a` is constrained.

---

### 4. Optimizer estimates that another plan is cheaper

Even if an index exists, MySQL may choose not to use it.

This is why:

> **Having an index does not guarantee that MySQL will use it.**

---

# 30. Index and LIKE ⭐⭐⭐⭐

Suppose:

```sql
CREATE INDEX idx_name
ON employees(name);
```

This may use the index:

```sql
WHERE name LIKE 'John%'
```

But:

```sql
WHERE name LIKE '%John%'
```

generally cannot efficiently use a normal B-tree index for the leading `%`.

---

# 31. Function on Indexed Column ⭐⭐⭐⭐

Suppose:

```sql
CREATE INDEX idx_join_date
ON employees(join_date);
```

Avoid unnecessarily doing:

```sql
WHERE YEAR(join_date) = 2026;
```

A range predicate is often better:

```sql
WHERE join_date >= '2026-01-01'
AND join_date < '2027-01-01';
```

This allows the index to be used more effectively in many cases.

---

# 32. Don't Index Everything ⭐⭐⭐⭐⭐

A common beginner mistake is:

> "Indexes make queries faster, so I'll create indexes on every column."

Don't.

Indexes have costs:

```text
Index
 ↓
Faster reads in suitable queries
 ↓
More storage
 ↓
More maintenance
 ↓
Potentially slower writes
```

Create indexes based on:

* Actual query patterns
* Primary/foreign key relationships
* Filtering
* Joining
* Sorting/grouping where appropriate
* Data distribution
* `EXPLAIN` output

---

# 33. Foreign Key Indexes

For example:

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    department_id INT,
    FOREIGN KEY (department_id)
        REFERENCES departments(id)
);
```

The foreign-key column should be indexed appropriately. InnoDB requires indexes for foreign-key constraints and may create one automatically if a suitable index doesn't already exist.

Still, you should understand the indexing needs of your common join/filter queries rather than assuming the automatically created index is always optimal.

---

# 34. Index for JOIN ⭐⭐⭐⭐⭐

Suppose:

```sql
SELECT e.name, d.department_name
FROM employees e
JOIN departments d
    ON e.department_id = d.id;
```

You generally want appropriate indexes on the columns used for the relationship.

Typically:

```text
departments.id
→ PRIMARY KEY

employees.department_id
→ INDEX
```

This can make joins much more efficient.

---

# 35. DROP INDEX

Remove an index:

```sql
DROP INDEX idx_email
ON employees;
```

---

# 36. Show Indexes

To see indexes on a table:

```sql
SHOW INDEX FROM employees;
```

This is useful when investigating an existing schema.

---

# 37. EXPLAIN ANALYZE ⭐⭐⭐⭐⭐

`EXPLAIN` shows the optimizer's planned execution.

For supported MySQL versions, `EXPLAIN ANALYZE` executes the query and provides actual execution information along with the plan.

Example:

```sql
EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department_id = 10;
```

This is extremely useful when comparing:

```text
Estimated behavior
vs
Actual behavior
```

---

# 38. EXPLAIN vs EXPLAIN ANALYZE

| EXPLAIN                                    | EXPLAIN ANALYZE                                   |
| ------------------------------------------ | ------------------------------------------------- |
| Shows execution plan                       | Executes query and shows actual execution details |
| Doesn't execute the SELECT in the same way | Actually runs it                                  |
| Good for plan inspection                   | Good for performance investigation                |
| Shows estimates                            | Shows actual execution metrics                    |

### Important

Be careful using `EXPLAIN ANALYZE` on expensive queries because it actually executes the query.

---

# 39. Practical Interview Example ⭐⭐⭐⭐⭐

### Query:

```sql
SELECT *
FROM employees
WHERE department_id = 10
ORDER BY salary DESC;
```

Suppose this is executed frequently.

Potential index:

```sql
CREATE INDEX idx_dept_salary
ON employees(department_id, salary);
```

Why?

The query uses:

```text
department_id
salary
```

in that order:

```text
WHERE department_id = 10
ORDER BY salary DESC
```

The composite index may allow MySQL to efficiently locate the department rows and potentially help with ordering.

But always verify the actual plan with:

```sql
EXPLAIN
```

---

# 40. Indexing — Important Interview Q&A ⭐⭐⭐⭐⭐

### Q1. What is an index?

> An index is a data structure that helps MySQL locate rows efficiently without scanning the entire table.

---

### Q2. What is the disadvantage of indexes?

> They consume storage and add overhead to `INSERT`, `UPDATE`, and `DELETE` operations.

---

### Q3. What is a composite index?

> An index containing multiple columns.

```sql
INDEX(department_id, salary)
```

---

### Q4. Does column order matter in a composite index?

**Yes.**

For:

```sql
INDEX(a, b, c)
```

the leading column `a` is important for efficient index usage.

---

### Q5. What is the leftmost-prefix rule?

> A composite B-tree index is most useful when queries constrain the leading columns of the index.

---

### Q6. Why might MySQL not use an existing index?

Possible reasons:

```text
Low selectivity
Function applied to column
Leading wildcard
Wrong composite-index prefix
Small table
Optimizer estimates another plan is cheaper
```

---

### Q7. What does `EXPLAIN` do?

> It shows MySQL's execution plan and helps identify how tables and indexes will be accessed.

---

### Q8. What does `type = ALL` usually mean?

> A full table scan.

---

### Q9. What does `key = NULL` mean?

> MySQL did not choose an index for that table access.

---

### Q10. What is a covering index?

> An index that contains all columns needed for a particular query, allowing MySQL to potentially answer the query directly from the index.

---

# ⭐ Index Quick Revision

```text
INDEX
→ Faster data lookup

PRIMARY KEY
→ Automatically indexed

UNIQUE
→ Unique + indexed

COMPOSITE INDEX
→ Multiple columns

LEFTMOST PREFIX
→ Leading columns matter

SELECTIVITY
→ How well a condition narrows rows

EXPLAIN
→ Shows query execution plan

EXPLAIN ANALYZE
→ Executes + shows actual execution details

possible_keys
→ Candidate indexes

key
→ Index actually chosen

rows
→ Estimated rows examined

type = ALL
→ Full table scan

Using index
→ Can indicate index-only/covering access

Using filesort
→ Additional sorting operation

Using temporary
→ Temporary structure used
```

## 🔥 Most Important to Remember

If you only remember **5 things** for an interview:

```text
1. Indexes improve reads but add write/storage cost.

2. Composite index column order matters.

3. INDEX(a,b,c) → a / a,b / a,b,c are the important prefixes.

4. EXPLAIN tells you how MySQL plans to execute a query.

5. Never assume an index is being used—
   verify with EXPLAIN.
```

**Next topic: Normalization — 1NF, 2NF, 3NF, BCNF and Denormalization.**
