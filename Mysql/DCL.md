# MySQL DCL — Data Control Language

Next is **DCL**, which deals with **database permissions and access control**.

For interviews, the two commands you mainly need to know are:

```text
GRANT
REVOKE
```

---

# 1. What is DCL?

**DCL = Data Control Language**

DCL is used to **control user access and permissions** on database objects.

Simple definition:

> DCL controls what database users are allowed to do.

Main commands:

```text
GRANT  → Give permissions
REVOKE → Remove permissions
```

---

# 2. GRANT ⭐⭐⭐

`GRANT` gives privileges to a user.

Basic syntax:

```sql
GRANT privilege
ON database_name.object_name
TO 'username'@'host';
```

---

## Example: Give SELECT permission

```sql
GRANT SELECT
ON company.employees
TO 'john'@'localhost';
```

Now John can query the `employees` table.

```sql
SELECT *
FROM company.employees;
```

---

# 3. Grant Multiple Privileges

You can give multiple privileges:

```sql
GRANT SELECT, INSERT, UPDATE
ON company.employees
TO 'john'@'localhost';
```

John can now:

```text
SELECT → Read
INSERT → Add data
UPDATE → Modify data
```

But he doesn't have `DELETE` permission.

---

# 4. Grant All Privileges

```sql
GRANT ALL PRIVILEGES
ON company.*
TO 'john'@'localhost';
```

This gives the user all available privileges on objects in the `company` database, subject to MySQL's privilege system.

### Important interview point

Avoid giving `ALL PRIVILEGES` unless the user actually needs them.

Follow the principle of:

> **Least privilege**

Give users only the permissions they require.

---

# 5. Grant Permission on All Databases

This is a powerful privilege and should be used carefully:

```sql
GRANT ALL PRIVILEGES
ON *.*
TO 'john'@'localhost';
```

This gives broad privileges across all databases accessible through that account.

---

# 6. REVOKE ⭐⭐⭐

`REVOKE` removes previously granted privileges.

Example:

```sql
REVOKE INSERT
ON company.employees
FROM 'john'@'localhost';
```

John can no longer insert records into that table.

---

# 7. Revoke Multiple Privileges

```sql
REVOKE INSERT, UPDATE
ON company.employees
FROM 'john'@'localhost';
```

---

# 8. REVOKE ALL PRIVILEGES

```sql
REVOKE ALL PRIVILEGES
ON company.*
FROM 'john'@'localhost';
```

Removes the privileges granted at that scope, subject to other privilege sources.

---

# 9. Common MySQL Privileges ⭐⭐⭐

Some important privileges to know:

```text
SELECT
INSERT
UPDATE
DELETE
CREATE
ALTER
DROP
INDEX
EXECUTE
```

### Meaning

| Privilege | Purpose                 |
| --------- | ----------------------- |
| `SELECT`  | Read data               |
| `INSERT`  | Add data                |
| `UPDATE`  | Modify data             |
| `DELETE`  | Delete data             |
| `CREATE`  | Create objects          |
| `ALTER`   | Modify structure        |
| `DROP`    | Remove objects          |
| `INDEX`   | Create/drop indexes     |
| `EXECUTE` | Execute stored routines |

---

# 10. CREATE USER ⭐⭐⭐

Before granting privileges, you commonly create a user.

```sql
CREATE USER 'john'@'localhost'
IDENTIFIED BY 'StrongPassword123!';
```

Then:

```sql
GRANT SELECT
ON company.employees
TO 'john'@'localhost';
```

### Important

In modern MySQL, don't use:

```sql
GRANT ...
```

as a substitute for creating a user. Create the account explicitly with `CREATE USER`, then grant privileges.

---

# 11. DROP USER

Remove a MySQL user account:

```sql
DROP USER 'john'@'localhost';
```

This removes the account and its privileges.

---

# 12. SHOW GRANTS ⭐⭐⭐

Very useful for checking what permissions a user has.

```sql
SHOW GRANTS FOR 'john'@'localhost';
```

This is an important practical DBA/interview command.

---

# 13. GRANT on Database vs Table

### Database-level permission

```sql
GRANT SELECT
ON company.*
TO 'john'@'localhost';
```

John can `SELECT` from tables in the `company` database.

### Table-level permission

```sql
GRANT SELECT
ON company.employees
TO 'john'@'localhost';
```

John can only `SELECT` from `employees`.

### Remember

```text
company.*
    ↓
All applicable objects in company

company.employees
    ↓
Only employees table
```

---

# 14. Column-Level Privileges ⭐⭐

MySQL can also grant privileges on specific columns.

Example:

```sql
GRANT SELECT (name, department_id)
ON company.employees
TO 'john'@'localhost';
```

John can read those specified columns through the granted privilege.

This can be useful when you want to restrict access to sensitive columns.

---

# 15. WITH GRANT OPTION ⭐⭐

A user can be given permission to grant their privileges to other users.

Example:

```sql
GRANT SELECT
ON company.employees
TO 'john'@'localhost'
WITH GRANT OPTION;
```

Now John can potentially grant that privilege to another user.

### Interview warning

`WITH GRANT OPTION` should be given carefully because it increases the user's ability to delegate privileges.

---

# 16. GRANT vs REVOKE ⭐⭐⭐

| Command  | Purpose           |
| -------- | ----------------- |
| `GRANT`  | Give privileges   |
| `REVOKE` | Remove privileges |

Easy memory:

```text
GRANT  → Give
REVOKE → Take back
```

---

# 17. DCL vs DDL vs DML vs DQL ⭐⭐⭐⭐⭐

You should be able to answer this quickly in an interview.

```text
DDL
→ Structure

DML
→ Data modification

DQL
→ Data retrieval

DCL
→ Permissions

TCL
→ Transactions
```

### Commands

| Category | Commands                                        | Purpose            |
| -------- | ----------------------------------------------- | ------------------ |
| **DDL**  | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME` | Database structure |
| **DML**  | `INSERT`, `UPDATE`, `DELETE`                    | Modify data        |
| **DQL**  | `SELECT`                                        | Read data          |
| **DCL**  | `GRANT`, `REVOKE`                               | Permissions        |
| **TCL**  | `COMMIT`, `ROLLBACK`, `SAVEPOINT`               | Transactions       |

---

# 18. Practical Interview Scenario ⭐⭐⭐

### Question:

You have a reporting user who should only be able to read employee data.

What would you do?

### Answer:

Create the user:

```sql
CREATE USER 'report_user'@'localhost'
IDENTIFIED BY 'StrongPassword123!';
```

Grant only `SELECT`:

```sql
GRANT SELECT
ON company.employees
TO 'report_user'@'localhost';
```

Verify:

```sql
SHOW GRANTS FOR 'report_user'@'localhost';
```

This follows the **principle of least privilege**.

---

# 19. Another Interview Scenario

### Question:

A user currently has `SELECT`, `INSERT`, and `UPDATE`, but you want to remove `UPDATE`.

```sql
REVOKE UPDATE
ON company.employees
FROM 'john'@'localhost';
```

Check:

```sql
SHOW GRANTS FOR 'john'@'localhost';
```

---

# 20. ⭐ DCL Quick Revision

```text
CREATE USER
→ Create database user

GRANT
→ Give permission

REVOKE
→ Remove permission

SHOW GRANTS
→ Check permissions

DROP USER
→ Remove user
```

### Most important privileges

```text
SELECT → Read
INSERT → Add
UPDATE → Modify
DELETE → Remove
CREATE → Create
ALTER  → Modify structure
DROP   → Remove object
```

### ⭐ Must-know interview questions

1. What is DCL?
2. What is `GRANT`?
3. What is `REVOKE`?
4. How do you create a MySQL user?
5. How do you check a user's privileges?
6. How do you give a user read-only access?
7. Database-level vs table-level privileges?
8. What is `WITH GRANT OPTION`?
9. What is the principle of least privilege?
10. Difference between DDL, DML, DQL, DCL and TCL?

---

### One important distinction

Don't confuse:

```text
GRANT/REVOKE
    ↓
Permissions

COMMIT/ROLLBACK
    ↓
Transactions
```

So now your MySQL interview notes are organized as:

```text
1. JOINs          ✅
2. DDL            ✅
3. DML            ✅
4. DQL            ✅
5. TCL            ✅
6. DCL            ✅
```

The next major section should be **MySQL Constraints + Keys** — `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, `DEFAULT`, `CHECK`, composite keys, candidate keys, and surrogate vs natural keys.
