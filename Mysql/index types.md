Since you're already comfortable with databases, I'll focus on production-oriented MySQL indexes—what they are, how InnoDB actually implements them, when to use them, and their trade-offs.

## How InnoDB stores indexes

The first distinction is between clustered and secondary indexes.

Every InnoDB table is organized around its clustered index. All other indexes are separate B+Tree structures whose leaf nodes store the primary key.

Example table:

SQL

```
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(100),
    created_at DATETIME,
    INDEX idx_email (email)
);
```

The clustered index stores:

|
PK

|

email

|

name

|

created_at

|
| --- | --- | --- | --- |
|

1

|

[a@x.com](mailto:a@x.com)

|

Alice

|

...

|
|

2

|

[b@x.com](mailto:b@x.com)

|

Bob

|

...

|

The secondary index stores:

|
email

|

PK

|
| --- | --- |
|

[a@x.com](mailto:a@x.com)

|

1

|
|

[b@x.com](mailto:b@x.com)

|

2

|

Searching by `email` requires:

1. Traverse `idx_email`

2. Get `id`

3. Lookup clustered index

This is called a bookmark lookup.

# 1. Clustered Index

The clustered index is the table itself.

![DB 인사이드 | MySQL Architecture - 7. InnoDB : On-Disk Structure](https://images.openai.com/static-rsc-4/qN0aQOCzlPT1LKE2wxeWvkQrLM4JX8qPGFlVbhSXBe25tMZ5BtixuacMTek6hY7wtiJ2ddFP5wbCctVG1edNlkeb_8dkqSf4hhm84gdzE46bQVvaj4fzoixkNxTHDhtsSraMraUM0uUTaAZcB02xFRkN9C7OanndStNe-kK2mE8?purpose=inline)

SQL

```
PRIMARY KEY(id)
```

Characteristics:

* only one per table

* leaf nodes contain complete rows

* rows are physically ordered by primary key

* excellent for range scans

Good:

SQL

```
SELECT *
FROM orders
WHERE id BETWEEN 1000 AND 2000;
```

Trade-off:

* random UUID primary keys cause page splits

* sequential BIGINT performs better

# 2. Secondary (Non-clustered) Index

The most common index.

SQL

```
CREATE INDEX idx_email
ON users(email);
```

Structure:

```
email
   |
   v
B+Tree
   |
Leaf -> email + PK
```

Useful for:

* equality search

* range search

* ordering

Example:

SQL

```
SELECT *
FROM users
WHERE email='a@example.com';
```

# 3. B+Tree Index

This is the default index type.

SQL

```
CREATE INDEX idx_name
ON users(name);
```

![\[Database\] 인덱스(Index) 동작 원리와 장단점 | 프로의 개발일지](https://images.openai.com/static-rsc-4/-Ttn2HYXaTeHN7bTTGsEzWmhrzfq3sk4-IWzIYHnTp2AhYMIRjszE8W7YVOAefjXniGHPaMG4LmUgyjUVID423i9oK-_nDGh7q74xutmzcQLI6wVGDxu3axIjqlNbYUunhJFqcILZgvkkG-rfAjYWRbAR1ux2ma1ZQrRZmVFp2U?purpose=inline)

Supports:

* `=`

* `>`

* `<`

* `BETWEEN`

* `ORDER BY`

* prefix search (`LIKE 'abc%'`)

Example:

SQL

```
WHERE name LIKE 'Joh%'
```

Uses the index.

But:

SQL

```
LIKE '%ohn'
```

Cannot use the B+Tree efficiently.

Time complexity:

* lookup: O(log⁡n)O(\log n)O(logn)

* range scan: very efficient

# 4. Unique Index

Guarantees uniqueness.

SQL

```
CREATE UNIQUE INDEX idx_email
ON users(email);
```

Example:

SQL

```
INSERT INTO users(email)
VALUES('a@example.com');
```

Duplicate insert fails.

Production uses:

* email

* username

* order_number

# 5. Composite (Multi-column) Index

One of the most important production indexes.

SQL

```
CREATE INDEX idx_user_status
ON orders(user_id,status);
```

![三道MySQL联合索引面试题，淘汰80%的面试者，你能答对几道 - 一灯架构 - 博客园](https://images.openai.com/static-rsc-4/K_Ekx-9cTGBF3LWWMrswS_JaYKuVqO5Ynrx8wx-bevHPJPvSC_xvJnlW659obmyKhu9qajsSzk9WM4hld5nboKcjSci95RXJzQdDcsS0HuwVWcxxHmv989OgTM1Ddez0Su6mTLCdt1wmMLns4CU1eaRVXWTlgICRDJRmwnnhD28?purpose=inline)

Stored as:

|
user_id

|

status

|

PK

|
| --- | --- | --- |
|

1

|

PAID

|

10

|
|

1

|

SHIPPED

|

12

|
|

2

|

PAID

|

15

|

Works for:

SQL

```
WHERE user_id=1
```

Works for:

SQL

```
WHERE user_id=1
AND status='PAID'
```

Does not efficiently work for:

SQL

```
WHERE status='PAID'
```

This is the Leftmost Prefix Rule.

# 6. Covering Index

A covering index satisfies the query without touching the clustered index.

Example:

SQL

```
CREATE INDEX idx_user_status_total
ON orders(user_id,status,total);
```

Query:

SQL

```
SELECT total
FROM orders
WHERE user_id=1
AND status='PAID';
```

Everything exists inside the index.

No extra table lookup.

Huge performance improvement.

# 7. Full-text Index

Used for text search.

SQL

```
CREATE FULLTEXT INDEX ft_content
ON articles(content);
```

![Database indexing basics: how indexes make queries faster](https://images.openai.com/static-rsc-4/LqkXMc3IA6IhOspjG1IrYZLv6mQrXiFobqoOzTF7Fvci_rhdPzv-NJAHei8NQQliyDvE4G-PIwpSD0jELid1UyZNdRd6Q76i-0zKzFH68PDSkB-KmF57D8gWU6JFyow9aoOYF3PuUjtDaK_Yt1L4r0Zp2TSk5UJB7oh40PAhWD4?purpose=inline)

Query:

SQL

```
SELECT *
FROM articles
WHERE MATCH(content)
AGAINST('mysql indexing');
```

Better than:

SQL

```
LIKE '%mysql%'
```

Good for:

* blogs

* documentation

* search

# 8. Spatial Index

For GIS data.

SQL

```
CREATE SPATIAL INDEX idx_location
ON stores(location);
```

![The One Index to Rule Them All: How GiST Made PostgreSQL Extensible | by Vedant Thakkar | Medium](https://images.openai.com/static-rsc-4/30Flkb7LTh7o5yWHCBuyRj_WTu_VuBYdhuJ49vtwplv92TOr6AKFrF6oP15baLAS6ZDzedMVEVbry4KZ8FhvCm-UoIgl76xjpFFdQFThiY2APEjgEeUqU68Tz7HZRrxYq9y1Wq2-RgMs0EhBCc8wXpVFbPG7FAZhbkT_lX_ML1w?purpose=inline)

Used with:

* `POINT`

* `POLYGON`

* `LINESTRING`

Example:

SQL

```
ST_Distance(...)
```

# 9. Hash Index (Limited)

MySQL itself has limited hash index support.

* Memory engine supports real hash indexes.

* InnoDB uses Adaptive Hash Index internally.

You generally don't create these manually.

Example:

SQL

```
ENGINE=MEMORY;
```

Hash index characteristics:

* equality lookup only

* no range search

* no ordering

# 10. Invisible Index (MySQL 8+)

Very useful in production.

SQL

```
ALTER TABLE users
ALTER INDEX idx_email INVISIBLE;
```

![Create MySQL Workbench query plan image from command line / terminal - Stack Overflow](https://images.openai.com/static-rsc-4/ariGKJCaMgknCUwsu4__hiFPd1sws5Iggwvg-3A-4A5AWM_vqN1DSd7wRPVAinWQV33f_jT_aKCMkK-Gu0tDnkLRRO08_jw8rls5uYNugelet-bchIjkwivVx9egiBzp5BswCmC6nr74OfwZj_HiH0ChCs7rBWlGTLJSkluOyA4?purpose=inline)

The index still exists.

The optimizer ignores it.

Perfect for safely testing before dropping an index.

If performance drops:

SQL

```
ALTER INDEX idx_email VISIBLE;
```

# 11. Descending Index

MySQL 8 introduced true descending indexes.

SQL

```
CREATE INDEX idx_created_desc
ON orders(created_at DESC);
```

Useful for:

SQL

```
ORDER BY created_at DESC
LIMIT 20;
```

Avoids sorting.

# Functional Index (Expression Index)

Instead of indexing a column, index an expression.

SQL

```
CREATE INDEX idx_lower_email
ON users ((LOWER(email)));
```

Now this uses the index:

SQL

```
WHERE LOWER(email)='abc@example.com';
```

# Prefix Index

Useful for very long strings.

SQL

```
CREATE INDEX idx_name_prefix
ON users(name(20));
```

Only first 20 characters are indexed.

Good for:

* URLs

* long VARCHAR columns

Trade-off:

* smaller index

* less selective

# Adaptive Hash Index (Internal)

InnoDB automatically creates hash structures for frequently accessed B+Tree pages.

![图文实录｜MySQL技术内幕系列分享：深入了解Adaptive Hash Index特性 - 墨天轮](https://images.openai.com/static-rsc-4/acLSlJUVCG0oQ04ARit6wnAzzkOd5eZOGavP-aremrni0Fhhh5re9H637xCTC7SiAJqGUGCCoOLEjfik7Qch_pGIci2SymIAuCjJvRkoHti1yG2ANPc9cCG_a9uPnSbRkEmEdP9uLfsX94rpfPhoeK7TV5K3T8-neKdDx_W5nF4?purpose=inline)

You don't manage it directly.

Purpose:

* speed repeated lookups

* reduce B+Tree traversal

# Choosing the right index

|
Query Pattern

|

Best Index

|
| --- | --- |
|

`WHERE id=1`

|

Clustered PK

|
|

`WHERE email='x'`

|

Unique/B+Tree

|
|

`WHERE price BETWEEN 10 AND 20`

|

B+Tree

|
|

`WHERE user_id=1 AND status='PAID'`

|

Composite

|
|

`ORDER BY created_at DESC LIMIT 10`

|

Descending

|
|

`MATCH AGAINST`

|

Full-text

|
|

GIS search

|

Spatial

|
|

Long VARCHAR

|

Prefix

|
|

Test before dropping

|

Invisible

|
|

`LOWER(email)`

|

Functional

|

## Production tips people often miss

1. Primary key choice matters more than many realize. A sequential `BIGINT AUTO_INCREMENT` usually produces fewer page splits than random UUIDs.

2. Composite indexes should match your query patterns, not just the columns you filter on. Include `ORDER BY` columns when appropriate.

3. Don't over-index. Every `INSERT`, `UPDATE`, and `DELETE` must maintain every index.

4. Use `EXPLAIN ANALYZE` (MySQL 8+) to verify the optimizer is actually using the index you designed.

5. Prefer covering indexes for hot read paths—they can eliminate expensive secondary-to-clustered lookups.

For a production-grade understanding, the next level is learning how MySQL's B+Tree pages, page splits, index cardinality, ICP (Index Condition Pushdown), MRR (Multi-Range Read), and the optimizer decide whether an index is used or ignored. Those internals explain many real-world performance surprises.
