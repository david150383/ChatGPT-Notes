Absolutely. Here are **SQL subquery-based interview questions with answers**, ranging from beginner to advanced. These are especially useful for **SQL Developer / Data Analyst / Backend** interviews.

Assume these tables:

```sql
Employee
---------
emp_id
emp_name
salary
dept_id
manager_id

Department
----------
dept_id
dept_name
```

---

## 1. Find employees earning more than the average salary

**Question:** Find employees whose salary is greater than the company's average salary.

**Answer:**

```sql
SELECT emp_id, emp_name, salary
FROM Employee
WHERE salary > (
    SELECT AVG(salary)
    FROM Employee
);
```

**Concept:** Scalar subquery.

---

## 2. Find the employee(s) with the highest salary

```sql
SELECT emp_id, emp_name, salary
FROM Employee
WHERE salary = (
    SELECT MAX(salary)
    FROM Employee
);
```

**Interview point:** Using `=` is appropriate because `MAX()` returns a single value.

---

## 3. Find the second-highest salary

### Using a subquery

```sql
SELECT MAX(salary) AS second_highest_salary
FROM Employee
WHERE salary < (
    SELECT MAX(salary)
    FROM Employee
);
```

This returns the **second distinct highest salary**.

---

## 4. Find employees earning more than their department's average salary

This is a very common interview question.

```sql
SELECT e.emp_id,
       e.emp_name,
       e.salary,
       e.dept_id
FROM Employee e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM Employee e2
    WHERE e2.dept_id = e.dept_id
);
```

Here, the inner query is a **correlated subquery** because it refers to `e.dept_id` from the outer query.

---

## 5. Find employees who work in the IT department

```sql
SELECT emp_id, emp_name
FROM Employee
WHERE dept_id = (
    SELECT dept_id
    FROM Department
    WHERE dept_name = 'IT'
);
```

This works when `dept_name = 'IT'` returns only one department.

---

## 6. Find employees working in departments located in a particular condition

Suppose we have:

```text
Department
dept_id | dept_name
1       | IT
2       | HR
3       | Finance
```

Find employees belonging to IT or Finance.

```sql
SELECT emp_id, emp_name
FROM Employee
WHERE dept_id IN (
    SELECT dept_id
    FROM Department
    WHERE dept_name IN ('IT', 'Finance')
);
```

**Concept:** Multi-row subquery + `IN`.

---

## 7. Find employees who have the same salary as at least one other employee

```sql
SELECT emp_id, emp_name, salary
FROM Employee e
WHERE salary IN (
    SELECT salary
    FROM Employee
    GROUP BY salary
    HAVING COUNT(*) > 1
);
```

This identifies duplicate salary values.

---

## 8. Find departments having at least one employee earning more than 100,000

```sql
SELECT dept_id, dept_name
FROM Department d
WHERE EXISTS (
    SELECT 1
    FROM Employee e
    WHERE e.dept_id = d.dept_id
      AND e.salary > 100000
);
```

**Concept:** `EXISTS` subquery.

### Interview question:

**Why use `EXISTS`?**

`EXISTS` checks whether at least one matching row exists. It doesn't need to return the actual matching data.

---

## 9. Find employees who don't belong to any department

Using `NOT EXISTS`:

```sql
SELECT e.emp_id, e.emp_name
FROM Employee e
WHERE NOT EXISTS (
    SELECT 1
    FROM Department d
    WHERE d.dept_id = e.dept_id
);
```

This is generally safer than `NOT IN` when NULLs may be involved.

---

## 10. Find employees earning more than their manager

Assume `manager_id` refers to another employee's `emp_id`.

```sql
SELECT e.emp_id,
       e.emp_name,
       e.salary
FROM Employee e
WHERE e.salary > (
    SELECT m.salary
    FROM Employee m
    WHERE m.emp_id = e.manager_id
);
```

This is another **correlated subquery**.

---

# Advanced Interview Questions

## 11. Find the highest-paid employee in each department

One approach using a correlated subquery:

```sql
SELECT e.emp_id,
       e.emp_name,
       e.salary,
       e.dept_id
FROM Employee e
WHERE e.salary = (
    SELECT MAX(e2.salary)
    FROM Employee e2
    WHERE e2.dept_id = e.dept_id
);
```

**Important:** This returns multiple employees if there is a salary tie.

---

## 12. Find departments whose average salary is greater than the company's average salary

```sql
SELECT dept_id
FROM Employee
GROUP BY dept_id
HAVING AVG(salary) > (
    SELECT AVG(salary)
    FROM Employee
);
```

This is a great question because it tests whether you understand **subqueries + GROUP BY + HAVING**.

---

## 13. Find employees whose salary is greater than every employee in the HR department

```sql
SELECT emp_id, emp_name, salary
FROM Employee
WHERE salary > ALL (
    SELECT e.salary
    FROM Employee e
    JOIN Department d
      ON e.dept_id = d.dept_id
    WHERE d.dept_name = 'HR'
);
```

### `ALL` means:

The employee's salary must be greater than **every value** returned by the subquery.

---

## 14. Find employees whose salary is greater than at least one employee in HR

```sql
SELECT emp_id, emp_name, salary
FROM Employee
WHERE salary > ANY (
    SELECT e.salary
    FROM Employee e
    JOIN Department d
      ON e.dept_id = d.dept_id
    WHERE d.dept_name = 'HR'
);
```

### Difference:

```text
> ALL  → greater than every value
> ANY  → greater than at least one value
```

---

## 15. Find the third-highest salary using subqueries

```sql
SELECT MAX(salary) AS third_highest_salary
FROM Employee
WHERE salary < (
    SELECT MAX(salary)
    FROM Employee
    WHERE salary < (
        SELECT MAX(salary)
        FROM Employee
    )
);
```

This finds the **third distinct highest salary**.

---

## 16. Find employees who earn the maximum salary in their department

```sql
SELECT e.emp_name,
       e.salary,
       e.dept_id
FROM Employee e
WHERE e.salary = (
    SELECT MAX(e2.salary)
    FROM Employee e2
    WHERE e2.dept_id = e.dept_id
);
```

### Follow-up interviewer question:

**What happens if two employees have the same maximum salary?**

Both employees will be returned.

---

# Very Common Conceptual Questions

### Q17. What is a subquery?

A **subquery** is a query nested inside another SQL query.

Example:

```sql
SELECT *
FROM Employee
WHERE salary > (
    SELECT AVG(salary)
    FROM Employee
);
```

The inner query executes to provide a value used by the outer query.

---

### Q18. What is a correlated subquery?

A correlated subquery references a column from the outer query.

Example:

```sql
SELECT e.emp_name, e.salary
FROM Employee e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM Employee e2
    WHERE e2.dept_id = e.dept_id
);
```

The inner query depends on the current row of the outer query.

---

### Q19. Difference between `IN` and `EXISTS`

**`IN`:**

```sql
WHERE dept_id IN (
    SELECT dept_id
    FROM Department
)
```

Compares a value against values returned by the subquery.

**`EXISTS`:**

```sql
WHERE EXISTS (
    SELECT 1
    FROM Department d
    WHERE d.dept_id = e.dept_id
)
```

Checks whether at least one matching row exists.

---

### Q20. What is the difference between `=` and `IN` with a subquery?

If the subquery returns **one value**:

```sql
WHERE dept_id = (
    SELECT dept_id
    FROM Department
    WHERE dept_name = 'IT'
);
```

If it can return **multiple values**:

```sql
WHERE dept_id IN (
    SELECT dept_id
    FROM Department
    WHERE dept_name IN ('IT', 'HR')
);
```

Using `=` with a multi-row subquery can produce an error in many SQL databases.

---

## ⭐ 5 questions I'd especially prepare for an interview

1. **Find the second-highest salary using a subquery.**
2. **Find employees earning more than their department average.**
3. **Find the highest-paid employee in each department.**
4. **Explain correlated vs non-correlated subqueries.**
5. **Explain `IN` vs `EXISTS` and `ANY` vs `ALL`.**

If you're preparing for an interview, I can also give you **30 SQL subquery interview questions with sample tables + expected output + solutions**, progressing from **easy → medium → hard**, like a real mock interview.
