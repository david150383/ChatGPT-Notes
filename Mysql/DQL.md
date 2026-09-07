Next, let's cover **DQL — Data Query Language**, mainly `SELECT`. This is one of the most important MySQL interview areas because it connects `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `DISTINCT`, subqueries, and aggregate functions.

# MySQL DQL — SELECT Interview Notes

## 1. What is DQL?

**DQL = Data Query Language**

It is used to **retrieve/read data** from database tables.

The primary command is:

```sql
SELECT
```

Basic syntax:

```sql
SELECT column1, column2
FROM table_name;
```

Example:

```sql
SELECT name, salary
FROM employees;
```

---

# 2. SELECT *

Get all columns:

```sql
SELECT *
FROM employees;
```

### Interview tip

`SELECT *` is convenient during development, but in production queries it is often better to select only the required columns.

Instead of:

```sql
SELECT *
FROM employees;
```

Prefer:

```sql
SELECT id, name, salary
FROM employees;
```

---

# 3. DISTINCT ⭐

Used to remove duplicate values from the result.

```sql
SELECT DISTINCT department_id
FROM employees;
```

Example:

```text
10
20
10
30
20
```

Result:

```text
10
20
30
```

### Multiple columns

```sql
SELECT DISTINCT department_id, job_title
FROM employees;
```

Here, MySQL removes duplicate **combinations** of `department_id + job_title`.

---

# 4. WHERE ⭐⭐⭐

`WHERE` filters individual rows.

```sql
SELECT *
FROM employees
WHERE salary > 50000;
```

Multiple conditions:

```sql
SELECT *
FROM employees
WHERE salary > 50000
  AND department_id = 10;
```

Using `OR`:

```sql
SELECT *
FROM employees
WHERE department_id = 10
   OR department_id = 20;
```

---

# 5. Comparison Operators

Common operators:

```text
=       Equal
<>      Not equal
!=      Not equal
>       Greater than
<       Less than
>=      Greater than or equal
<=      Less than or equal
```

Example:

```sql
SELECT *
FROM employees
WHERE salary >= 50000;
```

---

# 6. BETWEEN

Used to check whether a value falls within a range.

```sql
SELECT *
FROM employees
WHERE salary BETWEEN 50000 AND 80000;
```

### Important

`BETWEEN` is inclusive.

So:

```text
50000 ≤ salary ≤ 80000
```

Both `50000` and `80000` are included.

---

# 7. IN ⭐

Instead of writing multiple `OR` conditions:

```sql
SELECT *
FROM employees
WHERE department_id IN (10, 20, 30);
```

Instead of:

```sql
WHERE department_id = 10
   OR department_id = 20
   OR department_id = 30;
```

`IN` is cleaner.

---

# 8. NOT IN

```sql
SELECT *
FROM employees
WHERE department_id NOT IN (10, 20);
```

### Important interview point

Be careful with `NOT IN` when the subquery can return `NULL`, because SQL's three-valued logic can produce unexpected results.

---

# 9. LIKE ⭐⭐⭐

Used for pattern matching.

### Starts with A

```sql
SELECT *
FROM employees
WHERE name LIKE 'A%';
```

`%` means zero or more characters.

---

### Ends with A

```sql
SELECT *
FROM employees
WHERE name LIKE '%A';
```

---

### Contains A

```sql
SELECT *
FROM employees
WHERE name LIKE '%A%';
```

---

### Exactly one character

`_` represents exactly one character.

```sql
SELECT *
FROM employees
WHERE name LIKE 'J_hn';
```

Could match:

```text
John
Jahn
Jihn
```

---

# 10. NULL ⭐⭐⭐

To find NULL:

```sql
SELECT *
FROM employees
WHERE department_id IS NULL;
```

To find non-NULL:

```sql
SELECT *
FROM employees
WHERE department_id IS NOT NULL;
```

### Don't do this:

```sql
WHERE department_id = NULL;
```

Use:

```sql
IS NULL
```

because `NULL` represents an unknown/missing value.

---

# 11. ORDER BY ⭐⭐⭐

Used to sort results.

Ascending:

```sql
SELECT *
FROM employees
ORDER BY salary ASC;
```

Descending:

```sql
SELECT *
FROM employees
ORDER BY salary DESC;
```

`ASC` is the default.

So:

```sql
ORDER BY salary;
```

is equivalent to:

```sql
ORDER BY salary ASC;
```

---

# 12. Sort by Multiple Columns

```sql
SELECT *
FROM employees
ORDER BY department_id ASC,
         salary DESC;
```

Meaning:

1. Sort by department
2. Within each department, highest salary first

---

# 13. LIMIT ⭐⭐⭐

Used to restrict the number of rows returned.

```sql
SELECT *
FROM employees
LIMIT 5;
```

Returns 5 rows.

---

# 14. LIMIT + OFFSET

Find the second-highest distinct salary:

```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

Find the third:

```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;
```

General pattern:

```text
Nth highest
→ LIMIT 1 OFFSET N-1
```

---

# 15. Aggregate Functions ⭐⭐⭐

Very important for interviews.

Common aggregate functions:

```text
COUNT()
SUM()
AVG()
MIN()
MAX()
```

---

## COUNT()

```sql
SELECT COUNT(*)
FROM employees;
```

Counts rows.

---

## SUM()

```sql
SELECT SUM(salary)
FROM employees;
```

Returns total salary.

---

## AVG()

```sql
SELECT AVG(salary)
FROM employees;
```

Returns average salary.

---

## MIN()

```sql
SELECT MIN(salary)
FROM employees;
```

Returns minimum salary.

---

## MAX()

```sql
SELECT MAX(salary)
FROM employees;
```

Returns maximum salary.

---

# 16. COUNT(*) vs COUNT(column) ⭐⭐⭐

This is a common interview question.

```sql
SELECT COUNT(*)
FROM employees;
```

Counts all rows.

But:

```sql
SELECT COUNT(department_id)
FROM employees;
```

counts only rows where `department_id` is **not NULL**.

Example:

```text
department_id
-------------
10
20
NULL
30
```

Then:

```text
COUNT(*)             → 4
COUNT(department_id) → 3
```

---

# 17. GROUP BY ⭐⭐⭐

Used to group rows for aggregate calculations.

### Count employees by department

```sql
SELECT department_id,
       COUNT(*) AS employee_count
FROM employees
GROUP BY department_id;
```

Result might be:

```text
department_id | employee_count
--------------+---------------
10            | 15
20            | 8
30            | 12
```

---

# 18. SUM + GROUP BY

```sql
SELECT department_id,
       SUM(salary) AS total_salary
FROM employees
GROUP BY department_id;
```

---

# 19. AVG + GROUP BY

```sql
SELECT department_id,
       AVG(salary) AS average_salary
FROM employees
GROUP BY department_id;
```

---

# 20. MAX + GROUP BY

```sql
SELECT department_id,
       MAX(salary) AS highest_salary
FROM employees
GROUP BY department_id;
```

---

# 21. HAVING ⭐⭐⭐

`HAVING` filters groups after `GROUP BY`.

Example:

```sql
SELECT department_id,
       COUNT(*) AS employee_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

Returns departments containing more than 5 employees.

---

# 22. WHERE vs HAVING ⭐⭐⭐

This is a **must-know interview question**.

### WHERE

Filters rows **before grouping**.

```sql
SELECT department_id,
       COUNT(*)
FROM employees
WHERE salary > 50000
GROUP BY department_id;
```

### HAVING

Filters groups **after grouping**.

```sql
SELECT department_id,
       COUNT(*)
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

### Together

```sql
SELECT department_id,
       COUNT(*) AS total
FROM employees
WHERE salary > 50000
GROUP BY department_id
HAVING COUNT(*) > 5;
```

Meaning:

1. Keep employees earning > 50,000
2. Group by department
3. Keep departments having more than 5 such employees

---

# 23. Column Aliases

Give a temporary name to a column.

```sql
SELECT salary AS employee_salary
FROM employees;
```

You can also omit `AS`:

```sql
SELECT salary employee_salary
FROM employees;
```

For readability, `AS` is usually clearer.

---

# 24. CASE ⭐⭐

Used for conditional logic.

```sql
SELECT name,
       salary,
       CASE
           WHEN salary >= 100000 THEN 'High'
           WHEN salary >= 50000 THEN 'Medium'
           ELSE 'Low'
       END AS salary_category
FROM employees;
```

Example result:

```text
John   120000   High
David   70000   Medium
Mike    30000   Low
```

---

# 25. COALESCE ⭐⭐

Returns the first non-NULL value.

```sql
SELECT name,
       COALESCE(department_id, 0) AS department_id
FROM employees;
```

Another example:

```sql
SELECT name,
       COALESCE(phone, 'Not Available') AS phone
FROM employees;
```

---

# 26. SQL Execution Order ⭐⭐⭐

Very important for interviews.

Conceptually, SQL processes a query roughly in this order:

```text
FROM
 ↓
JOIN
 ↓
WHERE
 ↓
GROUP BY
 ↓
HAVING
 ↓
SELECT
 ↓
DISTINCT
 ↓
ORDER BY
 ↓
LIMIT
```

For example:

```sql
SELECT department_id,
       COUNT(*) AS total
FROM employees
WHERE salary > 50000
GROUP BY department_id
HAVING COUNT(*) > 5
ORDER BY total DESC
LIMIT 3;
```

Think:

```text
FROM       → Get data
WHERE      → Filter rows
GROUP BY   → Create groups
HAVING     → Filter groups
SELECT     → Choose output
ORDER BY   → Sort
LIMIT      → Restrict result
```

---

# 27. Subquery ⭐⭐⭐

A query inside another query.

### Employees earning above average salary

```sql
SELECT *
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);
```

The inner query:

```sql
SELECT AVG(salary)
FROM employees;
```

runs logically to provide the value used by the outer query.

---

# 28. Subquery with IN

Find employees belonging to IT or HR departments:

```sql
SELECT *
FROM employees
WHERE department_id IN (
    SELECT id
    FROM departments
    WHERE department_name IN ('IT', 'HR')
);
```

---

# 29. EXISTS ⭐⭐

Checks whether a matching row exists.

```sql
SELECT *
FROM employees e
WHERE EXISTS (
    SELECT 1
    FROM departments d
    WHERE d.id = e.department_id
);
```

### Interview question: EXISTS vs IN?

A simple interview answer:

> `IN` compares a value against a set of values, while `EXISTS` checks whether the subquery returns at least one row. Performance depends on the query, data, indexes, and optimizer, so don't claim that one is always faster.

---

# 30. CTE — Common Table Expression ⭐⭐⭐

A CTE is defined using `WITH`.

```sql
WITH high_salary AS (
    SELECT *
    FROM employees
    WHERE salary > 50000
)
SELECT *
FROM high_salary;
```

CTEs make complex queries easier to read and are especially useful with window functions.

### Example: Top 3 salaries

```sql
WITH ranked AS (
    SELECT *,
           DENSE_RANK() OVER (
               ORDER BY salary DESC
           ) AS rnk
    FROM employees
)
SELECT *
FROM ranked
WHERE rnk <= 3;
```

---

# 31. UNION vs UNION ALL ⭐⭐⭐

### UNION

Combines results and removes duplicates.

```sql
SELECT email FROM customers
UNION
SELECT email FROM suppliers;
```

### UNION ALL

Combines results and keeps duplicates.

```sql
SELECT email FROM customers
UNION ALL
SELECT email FROM suppliers;
```

### Remember

```text
UNION
→ Remove duplicates

UNION ALL
→ Keep duplicates
```

`UNION ALL` is generally preferable when you don't need duplicate elimination because MySQL doesn't have to perform that extra deduplication work.

---

# 32. Common Practical Interview Queries

### Find employees earning above average

```sql
SELECT *
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);
```

### Find second-highest salary

```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

### Find duplicate salaries

```sql
SELECT salary,
       COUNT(*) AS total
FROM employees
GROUP BY salary
HAVING COUNT(*) > 1;
```

### Find highest salary in each department

```sql
SELECT department_id,
       MAX(salary) AS max_salary
FROM employees
GROUP BY department_id;
```

### Find departments with more than 5 employees

```sql
SELECT department_id,
       COUNT(*) AS total
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

### Find top 3 salaries

```sql
SELECT *
FROM employees
ORDER BY salary DESC
LIMIT 3;
```

### Find top 3 distinct salaries

```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 3;
```

---

# ⭐ DQL Quick Revision

```text
SELECT       → Retrieve data
DISTINCT     → Remove duplicate results
WHERE        → Filter rows
GROUP BY     → Group rows
HAVING       → Filter groups
ORDER BY     → Sort results
LIMIT        → Restrict rows
OFFSET       → Skip rows
COUNT()      → Count
SUM()        → Total
AVG()        → Average
MIN()        → Minimum
MAX()        → Maximum
CASE         → Conditional logic
COALESCE()   → Replace NULL / first non-NULL
SUBQUERY     → Query inside query
CTE          → Temporary named result
EXISTS       → Check existence
UNION        → Combine + remove duplicates
UNION ALL    → Combine + keep duplicates
```

### ⭐ Most important DQL interview questions

1. `WHERE` vs `HAVING`
2. `GROUP BY`
3. `COUNT(*)` vs `COUNT(column)`
4. `UNION` vs `UNION ALL`
5. `IN` vs `EXISTS`
6. `WHERE` vs `ON` in JOINs
7. SQL execution order
8. `LIMIT` and `OFFSET`
9. Subquery vs CTE
10. Aggregate functions
11. `NULL` handling
12. `CASE` and `COALESCE`
13. Second/Nth highest salary
14. Top N per department
15. Window functions with filtering
