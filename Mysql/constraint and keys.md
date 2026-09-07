# MySQL Constraints & Keys — Part 1

Let's start with **Constraints & Keys**, one of the most important MySQL interview topics.

---

# 1. What is a Constraint?

A **constraint** is a rule applied to a table/column to maintain **data integrity and correctness**.

Main MySQL constraints:

```text id="q9n8k5"
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
DEFAULT
CHECK
```

Example:

```sql id="9x4d8n"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    salary DECIMAL(10,2) CHECK (salary > 0),
    department_id INT,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
```

Here we have:

```text id="o0gk9z"
PRIMARY KEY → id
NOT NULL     → name
UNIQUE       → email
CHECK        → salary > 0
DEFAULT      → status
```

---

# 2. PRIMARY KEY ⭐⭐⭐⭐⭐

A **PRIMARY KEY** uniquely identifies each row in a table.

```sql id="mx6h1k"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10,2)
);
```

Example:

```text id="g4n4jz"
id   name
---  ------
1    John
2    David
3    Sarah
```

The `id` uniquely identifies each employee.

### Primary key rules

A primary key:

* Must be unique
* Cannot contain `NULL`
* A table can have only **one primary key constraint**
* Can consist of one or multiple columns

---

# 3. Can a table have multiple PRIMARY KEYs?

**No.**

This is invalid:

```sql id="qk2a3a"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    email VARCHAR(255) PRIMARY KEY
);
```

A table can have only **one PRIMARY KEY constraint**.

However, that one primary key can contain multiple columns.

That is called a **composite primary key**.

---

# 4. Composite PRIMARY KEY ⭐⭐⭐⭐

A composite key uses **two or more columns together** to uniquely identify a row.

Example:

```sql id="x8v0qj"
CREATE TABLE student_courses (
    student_id INT,
    course_id INT,
    PRIMARY KEY (student_id, course_id)
);
```

Here:

```text id="1x7n5y"
student_id + course_id
        ↓
Together uniquely identify the row
```

Example:

```text id="w0h2sp"
student_id   course_id
-----------  ---------
1            101
1            102
2            101
```

Student `1` can have multiple courses, and course `101` can have multiple students.

But this combination cannot repeat:

```text id="7jhy4b"
1 + 101
```

---

# 5. UNIQUE Constraint ⭐⭐⭐⭐⭐

`UNIQUE` ensures that values are not duplicated.

Example:

```sql id="g3h5x0"
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE
);
```

This is allowed:

```text id="h0v5d8"
john@gmail.com
david@gmail.com
sarah@gmail.com
```

But this isn't:

```text id="u8gq3n"
john@gmail.com
john@gmail.com
```

---

# 6. PRIMARY KEY vs UNIQUE ⭐⭐⭐⭐⭐

Very common interview question.

| PRIMARY KEY                     | UNIQUE                              |
| ------------------------------- | ----------------------------------- |
| Uniquely identifies a row       | Ensures uniqueness                  |
| Only one primary key constraint | Multiple UNIQUE constraints allowed |
| Cannot contain NULL             | NULL handling differs in MySQL      |
| Commonly used as row identity   | Used for alternate unique values    |

Example:

```sql id="y8xv8d"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE
);
```

Here:

```text id="e3qv3j"
id     → PRIMARY KEY
email  → UNIQUE
phone  → UNIQUE
```

One table can have multiple `UNIQUE` constraints.

---

# 7. NOT NULL ⭐⭐⭐⭐

`NOT NULL` means a column cannot contain `NULL`.

```sql id="n0h8b9"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
```

This is invalid:

```sql id="y0t5v6"
INSERT INTO employees (id, name)
VALUES (1, NULL);
```

Because `name` is `NOT NULL`.

---

# 8. DEFAULT ⭐⭐⭐

Provides a default value when a value isn't supplied.

```sql id="7nq9xn"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
```

Then:

```sql id="f7nqg7"
INSERT INTO employees (id, name)
VALUES (1, 'John');
```

`status` automatically gets:

```text id="l6p1cj"
ACTIVE
```

---

# 9. CHECK ⭐⭐⭐⭐

Ensures that data satisfies a condition.

```sql id="2j0p2f"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    salary DECIMAL(10,2),
    CHECK (salary > 0)
);
```

This should be rejected:

```sql id="y1zzqf"
INSERT INTO employees
VALUES (1, -5000);
```

because:

```text id="m4jz99"
salary > 0
```

is violated.

---

# 10. FOREIGN KEY ⭐⭐⭐⭐⭐

A **FOREIGN KEY** establishes a relationship between tables and helps enforce referential integrity.

Example:

```sql id="j9c7kf"
CREATE TABLE departments (
    id INT PRIMARY KEY,
    department_name VARCHAR(100)
);
```

Then:

```sql id="7cz8t8"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
);
```

Relationship:

```text id="3afj55"
departments
     |
     | id
     ↓
employees
 department_id
```

If department `10` doesn't exist:

```sql id="g6a7fw"
INSERT INTO employees
VALUES (1, 'John', 999);
```

This can fail because department `999` doesn't exist in the referenced table.

---

# 11. Parent and Child Table

In this example:

```text id="5n8j88"
departments → Parent table
employees   → Child table
```

Because:

```text id="0v20jd"
departments.id
      ↑
      |
employees.department_id
```

The foreign key is in the child table.

---

# 12. ON DELETE CASCADE ⭐⭐⭐⭐⭐

Very important interview topic.

Suppose:

```sql id="n8m0vs"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
);
```

If department `10` is deleted:

```sql id="xj4p2h"
DELETE FROM departments
WHERE id = 10;
```

Employees belonging to department `10` are automatically deleted.

```text id="h1n8k6"
Delete department
       ↓
Delete related employees
```

### Interview answer

> `ON DELETE CASCADE` automatically deletes child rows when the referenced parent row is deleted.

---

# 13. ON DELETE SET NULL

Instead of deleting the child row, set its foreign key to `NULL`.

```sql id="q1m8q4"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT NULL,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
);
```

Delete department:

```sql id="3vl9fu"
DELETE FROM departments
WHERE id = 10;
```

Employee remains:

```text id="r0s0dl"
employee_id | department_id
------------+--------------
1           | NULL
```

---

# 14. ON UPDATE CASCADE

If the referenced parent key changes, the child foreign key is automatically updated.

```sql id="qzv8rd"
FOREIGN KEY (department_id)
REFERENCES departments(id)
ON UPDATE CASCADE
```

Conceptually:

```text id="x8c6zk"
departments.id
10 → 100

employees.department_id
10 → 100
```

---

# 15. CASCADE vs SET NULL

| Option                | What happens?                                                              |
| --------------------- | -------------------------------------------------------------------------- |
| `ON DELETE CASCADE`   | Delete child rows                                                          |
| `ON DELETE SET NULL`  | Set child FK to NULL                                                       |
| `ON DELETE RESTRICT`  | Prevent parent deletion when children exist                                |
| `ON DELETE NO ACTION` | MySQL/InnoDB behavior is effectively restrictive for immediate FK checking |

### Easy memory

```text id="e2ujk1"
CASCADE
→ Delete child

SET NULL
→ Keep child, remove relationship

RESTRICT
→ Don't allow parent deletion
```

---

# 16. Candidate Key ⭐⭐⭐⭐

A **candidate key** is a column or combination of columns that can uniquely identify a row.

Suppose:

```text id="h4o3xk"
employees

id
email
phone
name
```

If both `id` and `email` are unique:

```text id="3n9b8f"
id     → Candidate key
email  → Candidate key
```

One candidate key is selected as the **primary key**.

The others can be called **alternate keys**.

---

# 17. Alternate Key

A candidate key that wasn't selected as the primary key.

Example:

```sql id="2z3m2f"
CREATE TABLE employees (
    id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE
);
```

Conceptually:

```text id="5by6v3"
id     → Primary key
email  → Alternate key
```

---

# 18. Natural Key vs Surrogate Key ⭐⭐⭐⭐

### Natural Key

A real-world value that naturally identifies an entity.

Examples:

```text id="8q8zq5"
Email
Phone number
National identifier
ISBN
```

### Surrogate Key

An artificial/generated identifier.

Example:

```sql id="8y6w4v"
id INT AUTO_INCREMENT PRIMARY KEY
```

Example:

```text id="ujc2y9"
id    email
---   ----------------
1     john@gmail.com
2     david@gmail.com
```

Here:

```text id="qv0c7k"
id    → Surrogate key
email → Natural/business key
```

---

# 19. AUTO_INCREMENT ⭐⭐⭐

Frequently used with primary keys.

```sql id="0w8y7r"
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);
```

Insert:

```sql id="q0w0fr"
INSERT INTO employees (name)
VALUES ('John');
```

MySQL automatically generates the ID.

Example:

```text id="zq8h9w"
1
2
3
4
...
```

---

# 20. Constraint Naming

You can explicitly name constraints.

```sql id="4z8l1w"
CREATE TABLE employees (
    id INT,
    department_id INT,

    CONSTRAINT pk_employee
        PRIMARY KEY (id),

    CONSTRAINT fk_employee_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
);
```

This makes database errors and schema maintenance easier to understand.

---

# 21. All Constraints — Quick Revision ⭐⭐⭐⭐⭐

```text id="by2f95"
PRIMARY KEY
→ Unique row identifier
→ Cannot be NULL
→ One PK constraint per table

UNIQUE
→ Prevent duplicate values
→ Multiple UNIQUE constraints allowed

NOT NULL
→ Value must be provided

DEFAULT
→ Provides default value

CHECK
→ Validates a condition

FOREIGN KEY
→ Maintains relationship/referential integrity
```

---

# 22. All Important Keys

```text id="k0ov3g"
PRIMARY KEY
→ Main row identifier

FOREIGN KEY
→ References another table

CANDIDATE KEY
→ Any minimal unique identifier candidate

ALTERNATE KEY
→ Candidate key not selected as primary

COMPOSITE KEY
→ Key made from multiple columns

NATURAL KEY
→ Real-world meaningful identifier

SURROGATE KEY
→ Artificial/generated identifier
```

---

# ⭐ Most Important Interview Q&A

### Q1. Can a table have multiple primary keys?

**No.** A table can have only one primary key constraint, but that primary key can contain multiple columns.

### Q2. Can a primary key contain NULL?

**No.**

### Q3. Can a table have multiple UNIQUE constraints?

**Yes.**

### Q4. Primary key vs foreign key?

```text id="gn3n9f"
PRIMARY KEY
→ Identifies a row in its own table

FOREIGN KEY
→ References a key in another table
```

### Q5. What is a composite key?

> A key consisting of two or more columns used together to uniquely identify a row.

### Q6. What is referential integrity?

> It ensures that relationships between related tables remain valid, primarily through foreign keys.

### Q7. What does ON DELETE CASCADE do?

> Automatically deletes related child records when the referenced parent record is deleted.

### Q8. What does ON DELETE SET NULL do?

> Keeps the child record but sets its foreign-key column to `NULL`.

### Q9. Natural vs surrogate key?

```text id="d5x3h1"
Natural  → Real-world identifier
Surrogate → Artificial/generated identifier
```

### Q10. What is the purpose of constraints?

> To enforce data integrity and prevent invalid or inconsistent data.

---

## 🎯 What to Learn Next

After **Constraints & Keys**, the next topic should be:

**Indexes + `EXPLAIN`** ⭐⭐⭐⭐⭐

That's a particularly important section for interviews because it covers **how MySQL finds data efficiently, composite indexes, index order, covering indexes, when indexes are not used, and query performance**.
