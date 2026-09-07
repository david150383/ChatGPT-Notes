# MySQL DDL and DML — Interview Notes

This is an important distinction for interviews. The easiest way to remember it is:

```text
DDL → Structure of the database
DML → Data inside the tables
```

---

# 1. What is DDL?

**DDL = Data Definition Language**

DDL is used to **create, modify, and delete database objects/structure**.

### Main DDL commands

```text
CREATE
ALTER
DROP
TRUNCATE
RENAME
```

---

# 2. CREATE

Used to create databases, tables, indexes, etc.

### Create database

```sql
CREATE DATABASE company;
```

### Create table

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10,2),
    department_id INT,
    join_date DATE
);
```

### Create table with foreign key

```sql
CREATE TABLE departments (
    id INT PRIMARY KEY,
    department_name VARCHAR(100)
);

CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10,2),
    department_id INT,
    
    FOREIGN KEY (department_id)
        REFERENCES departments(id)
);
```

### Interview Q: What does `CREATE` do?

> `CREATE` is used to create database objects such as databases, tables, indexes, views, etc.

---

# 3. ALTER

Used to **modify an existing table's structure**.

### Add a column

```sql
ALTER TABLE employees
ADD age INT;
```

### Add multiple columns

```sql
ALTER TABLE employees
ADD (
    phone VARCHAR(20),
    address VARCHAR(200)
);
```

### Modify column datatype

```sql
ALTER TABLE employees
MODIFY salary DECIMAL(12,2);
```

### Rename a column

```sql
ALTER TABLE employees
RENAME COLUMN name TO employee_name;
```

### Drop a column

```sql
ALTER TABLE employees
DROP COLUMN age;
```

### Add a constraint

```sql
ALTER TABLE employees
ADD CONSTRAINT fk_department
FOREIGN KEY (department_id)
REFERENCES departments(id);
```

### Interview Q: What is ALTER?

> `ALTER` changes the structure of an existing database object, usually a table.

---

# 4. DROP

`DROP` removes the **database object itself**.

### Drop table

```sql
DROP TABLE employees;
```

After this:

```text
employees table → gone
data             → gone
table structure  → gone
```

### Drop database

```sql
DROP DATABASE company;
```

This removes the database and its objects.

### Interview Q: DROP vs DELETE?

```text
DROP
→ Removes the table itself

DELETE
→ Removes rows from the table
```

---

# 5. TRUNCATE ⭐

`TRUNCATE` removes **all rows** from a table but keeps the table structure.

```sql
TRUNCATE TABLE employees;
```

After:

```text
Data       → Removed
Table      → Exists
Columns    → Exist
Indexes    → Remain
Structure  → Remains
```

### Important

You cannot use:

```sql
TRUNCATE TABLE employees
WHERE department_id = 10;
```

`TRUNCATE` removes all rows.

If you want specific rows:

```sql
DELETE FROM employees
WHERE department_id = 10;
```

---

# 6. RENAME

Used to rename a table.

```sql
RENAME TABLE employees TO staff;
```

Another syntax supported by MySQL:

```sql
ALTER TABLE employees
RENAME TO staff;
```

---

# 7. CREATE INDEX

Indexes are also database objects.

```sql
CREATE INDEX idx_employee_email
ON employees(email);
```

Unique index:

```sql
CREATE UNIQUE INDEX idx_unique_email
ON employees(email);
```

---

# 8. DROP INDEX

Remove an index:

```sql
DROP INDEX idx_employee_email
ON employees;
```

---

# 9. DDL Quick Revision

| Command    | Purpose          |
| ---------- | ---------------- |
| `CREATE`   | Create object    |
| `ALTER`    | Modify structure |
| `DROP`     | Delete object    |
| `TRUNCATE` | Remove all rows  |
| `RENAME`   | Rename object    |

### Memory trick

```text
CREATE    → Make
ALTER     → Change
DROP      → Destroy
TRUNCATE  → Empty
RENAME    → Rename
```

---

# 10. What is DML?

**DML = Data Manipulation Language**

DML is used to **insert, modify, and delete data inside tables**.

The main commands are:

```text
INSERT
UPDATE
DELETE
```

Some interview discussions also mention `SELECT`, but strictly speaking, `SELECT` is generally classified as **DQL (Data Query Language)** rather than DML.

---

# 11. INSERT ⭐

Used to add new rows.

### Insert one record

```sql
INSERT INTO employees
    (id, name, salary, department_id)
VALUES
    (1, 'John', 60000, 10);
```

### Insert multiple records

```sql
INSERT INTO employees
    (id, name, salary, department_id)
VALUES
    (1, 'John', 60000, 10),
    (2, 'David', 70000, 20),
    (3, 'Sarah', 80000, 10);
```

### Insert from another table

```sql
INSERT INTO employees_backup
    (id, name, salary)
SELECT id, name, salary
FROM employees;
```

This is a very useful practical query.

---

# 12. UPDATE ⭐

Used to modify existing data.

### Update one employee

```sql
UPDATE employees
SET salary = 70000
WHERE id = 1;
```

### Update multiple columns

```sql
UPDATE employees
SET salary = 75000,
    department_id = 20
WHERE id = 1;
```

### Increase everyone's salary by 10%

```sql
UPDATE employees
SET salary = salary * 1.10;
```

### Increase salary only for IT employees

```sql
UPDATE employees
SET salary = salary * 1.10
WHERE department_id = 10;
```

### 🚨 Interview warning

Always check the `WHERE` condition.

This:

```sql
UPDATE employees
SET salary = 70000;
```

updates **every employee**.

---

# 13. DELETE ⭐

Used to delete rows from a table.

### Delete one employee

```sql
DELETE FROM employees
WHERE id = 1;
```

### Delete employees from a department

```sql
DELETE FROM employees
WHERE department_id = 10;
```

### Delete all rows

```sql
DELETE FROM employees;
```

The table itself still exists.

---

# 14. DELETE vs TRUNCATE vs DROP ⭐⭐⭐

This is one of the most common interview questions.

| Feature                  | DELETE            | TRUNCATE           | DROP         |
| ------------------------ | ----------------- | ------------------ | ------------ |
| Removes rows             | Yes               | Yes, all           | Yes          |
| `WHERE` allowed          | Yes               | No                 | No           |
| Table remains            | Yes               | Yes                | ❌ No         |
| Structure remains        | Yes               | Yes                | ❌ No         |
| Can remove selected rows | Yes               | No                 | No           |
| Typical use              | Selected/all data | Empty entire table | Remove table |

### Easy way to remember

```text
DELETE
→ Delete DATA

TRUNCATE
→ Empty TABLE

DROP
→ Delete TABLE
```

---

# 15. DDL vs DML ⭐⭐⭐

### DDL

Deals mainly with **structure**.

```sql
CREATE TABLE employees (...);

ALTER TABLE employees ADD age INT;

TRUNCATE TABLE employees;

DROP TABLE employees;
```

### DML

Deals with **data**.

```sql
INSERT INTO employees ...;

UPDATE employees
SET salary = 50000;

DELETE FROM employees
WHERE id = 10;
```

### Simple interview answer

> DDL is used to define and modify database structures, while DML is used to manipulate the data stored in those structures.

---

# 16. DDL vs DML — Quick Table

| DDL                      | DML                        |
| ------------------------ | -------------------------- |
| Data Definition Language | Data Manipulation Language |
| Works with structure     | Works with data            |
| `CREATE`                 | `INSERT`                   |
| `ALTER`                  | `UPDATE`                   |
| `DROP`                   | `DELETE`                   |
| `TRUNCATE`               | —                          |
| `RENAME`                 | —                          |

---

# 17. What About SELECT?

This is a common interview confusion.

```sql
SELECT *
FROM employees;
```

`SELECT` is generally classified as **DQL — Data Query Language**.

So you can remember:

```text
DDL → Structure
DML → Manipulate data
DQL → Query/read data
DCL → Permissions
TCL → Transactions
```

---

# 18. The Bigger SQL Classification ⭐⭐⭐

For interviews, remember these five categories:

```text
DDL
Data Definition Language
CREATE
ALTER
DROP
TRUNCATE
RENAME


DML
Data Manipulation Language
INSERT
UPDATE
DELETE


DQL
Data Query Language
SELECT


DCL
Data Control Language
GRANT
REVOKE


TCL
Transaction Control Language
COMMIT
ROLLBACK
SAVEPOINT
```

We'll cover **DQL, DCL, and TCL separately**, because especially **TCL + transactions + COMMIT/ROLLBACK** are common MySQL interview topics.

---

## ⭐ Must-Remember Interview Questions

**Q: Is `TRUNCATE` DDL or DML?**

> `TRUNCATE` is generally classified as DDL in MySQL.

**Q: Is `SELECT` DML?**

> Strictly, `SELECT` is generally classified as DQL.

**Q: Which command changes table structure?**

> `ALTER`.

**Q: Which command removes the table completely?**

> `DROP`.

**Q: Which command removes all rows but keeps the table?**

> `TRUNCATE`.

**Q: Which commands modify table data?**

> `INSERT`, `UPDATE`, and `DELETE`.

**Q: Which command can delete selected rows?**

> `DELETE`, because it supports `WHERE`.

**Q: Can TRUNCATE use WHERE?**

> No.

**Q: What happens if you forget WHERE in UPDATE/DELETE?**

> The operation can affect **all rows**, so always verify the condition before executing it.
