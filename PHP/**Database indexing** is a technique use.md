**Database indexing** is a technique used to improve the speed of data retrieval operations in a database. An index is a separate data structure that allows the database management system (DBMS) to locate rows quickly without scanning the entire table.

### How an Index Works

Think of an index in a book:

* Without an index, you read every page to find a topic.
* With an index, you go directly to the page number.

Similarly, a database index helps find records much faster.

### Example

Suppose you have a table named `Students`:

| Student_ID | Name  | Age |
| ---------- | ----- | --- |
| 101        | Alice | 20  |
| 102        | Bob   | 21  |
| 103        | Carol | 22  |

If you frequently run:

```sql
SELECT * FROM Students
WHERE Student_ID = 102;
```

Creating an index:

```sql
CREATE INDEX idx_student_id
ON Students(Student_ID);
```

The database can quickly locate the row with `Student_ID = 102` instead of scanning every record.

### Types of Indexes

1. **Primary Index**

   * Created automatically on the primary key.
   * Values are unique.
   * Example: `Student_ID`.

2. **Secondary Index**

   * Created on non-primary key columns.
   * Improves searches on those columns.
   * Example: `Name`.

3. **Unique Index**

   * Ensures all values in the indexed column are unique.

4. **Composite (Multi-column) Index**

   * Created on two or more columns.
   * Example:

     ```sql
     CREATE INDEX idx_name_age
     ON Students(Name, Age);
     ```

5. **Clustered Index**

   * Determines the physical order of data in the table.
   * Usually only one clustered index per table.

6. **Non-clustered Index**

   * Stores pointers to the actual data.
   * A table can have multiple non-clustered indexes.

### Advantages

* Faster data retrieval (`SELECT` queries).
* Improves `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` performance.
* Reduces query execution time.

### Disadvantages

* Requires additional storage space.
* Slows down `INSERT`, `UPDATE`, and `DELETE` operations because indexes must also be updated.
* Too many indexes can reduce overall database performance.

### When to Use Indexes

Create indexes on:

* Frequently searched columns.
* Primary and foreign keys.
* Columns used in joins.
* Columns used in sorting (`ORDER BY`) or grouping (`GROUP BY`).

Avoid indexing:

* Small tables.
* Columns with very few distinct values (e.g., a `Gender` column with only "Male" and "Female").
* Columns that are updated very frequently unless necessary.

### Summary

Database indexing is an optimization technique that speeds up data retrieval by maintaining a searchable data structure. While indexes significantly improve query performance, they also consume storage and can slow write operations, so they should be created thoughtfully.

### Types of Database Indexing

Database indexes can be classified in several ways based on how they store and organize data.

### 1. **Primary Index**

* Created automatically when a **primary key** is defined.
* The indexed column contains unique values.
* Data is usually stored in the same order as the index.

**Example:**

```sql
CREATE TABLE Student (
    Student_ID INT PRIMARY KEY,
    Name VARCHAR(50)
);
```

Here, `Student_ID` gets a primary index.

---

### 2. **Secondary Index**

* Created on columns other than the primary key.
* Does not affect the physical order of data.
* Helps speed up searches on frequently used columns.

**Example:**

```sql
CREATE INDEX idx_student_name
ON Student(Name);
```

---

### 3. **Clustered Index**

* Determines the physical order of data in a table.
* The actual table data is stored in the order of the index.
* Only **one clustered index** can exist per table.

**Example:**

```sql
CREATE CLUSTERED INDEX idx_id
ON Student(Student_ID);
```

**Advantages:**

* Very fast for range queries.
* Faster data retrieval.

---

### 4. **Non-Clustered Index**

* Stored separately from the actual data.
* Contains pointers to the location of the data.
* A table can have multiple non-clustered indexes.

**Example:**

```sql
CREATE NONCLUSTERED INDEX idx_name
ON Student(Name);
```

---

### 5. **Unique Index**

* Ensures that all values in the indexed column are different.
* Prevents duplicate values.

**Example:**

```sql
CREATE UNIQUE INDEX idx_email
ON Student(Email);
```

---

### 6. **Composite Index (Multi-column Index)**

* An index created using more than one column.
* Useful when queries filter or sort using multiple columns.

**Example:**

```sql
CREATE INDEX idx_name_age
ON Student(Name, Age);
```

Works well for:

```sql
SELECT *
FROM Student
WHERE Name='John' AND Age=20;
```

---

### 7. **B-Tree Index**

* The most commonly used index structure.
* Organizes data in a balanced tree format.
* Provides fast searching, insertion, and deletion.

Used by many databases such as:

* MySQL
* PostgreSQL
* Oracle
* SQL Server

---

### 8. **Hash Index**

* Uses a hash function to locate records.
* Very fast for exact-match searches.

Example:

```sql
SELECT *
FROM Student
WHERE Student_ID = 101;
```

**Limitation:**

* Not suitable for range queries like:

```sql
WHERE Student_ID BETWEEN 100 AND 200;
```

---

### 9. **Bitmap Index**

* Uses bitmaps to represent data values.
* Effective for columns with a small number of distinct values.

Example:

* Gender: Male/Female
* Status: Active/Inactive

Commonly used in data warehouses.

---

### 10. **Full-Text Index**

* Used for searching large text fields.
* Allows keyword-based searching.

Example:

```sql
SELECT *
FROM Books
WHERE MATCH(Description)
AGAINST('database');
```

---

### 11. **Function-Based Index**

* Index is created based on the result of a function or expression.

Example:

```sql
CREATE INDEX idx_upper_name
ON Employee(UPPER(Name));
```

Useful when queries use functions on columns.

---

### Summary Table

| Index Type           | Main Purpose                     |
| -------------------- | -------------------------------- |
| Primary Index        | Fast access using primary key    |
| Secondary Index      | Faster search on non-key columns |
| Clustered Index      | Physical data ordering           |
| Non-clustered Index  | Separate lookup structure        |
| Unique Index         | Prevent duplicate values         |
| Composite Index      | Search using multiple columns    |
| B-Tree Index         | General-purpose fast searching   |
| Hash Index           | Fast exact matches               |
| Bitmap Index         | Low-cardinality data             |
| Full-Text Index      | Text searching                   |
| Function-Based Index | Index computed values            |

The most commonly used indexes in real-world databases are **B-Tree, clustered, non-clustered, primary, secondary, and composite indexes**.
