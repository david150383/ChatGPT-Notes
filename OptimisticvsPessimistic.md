Optimistic Locking vs Pessimistic Locking are two concurrency control mechanisms used in databases to handle multiple transactions accessing or modifying the same data simultaneously.

The key difference is:

- Optimistic locking: Assumes conflicts are rare. Allows multiple transactions to proceed and checks for conflicts when updating.
- Pessimistic locking: Assumes conflicts are likely. Locks the data before modifying it to prevent other transactions from changing it.

## 1. Optimistic Locking

Optimistic locking does not lock a database record when reading it. Instead, it uses a version number or timestamp to detect whether another transaction has modified the record.

Example:

Suppose a bank account has:

text

```text
Account Balance = 1000
Version = 1
```

Two users read the same account simultaneously.

Transaction A

User 1

Reads balance = 1000, version = 1.

Transaction B

User 2

Reads balance = 1000, version = 1.

Transaction A updates first

sql

```sql
UPDATE accounts
SET balance = 900,
    version = 2
WHERE id = 1 AND version = 1;
```

Success — 1 row updatedTransaction B tries to update

sql

```sql
UPDATE accounts
SET balance = 800,
    version = 2
WHERE id = 1 AND version = 1;
```

Conflict — 0 rows updatedTransaction B detects that the version has changed and must retry or report a conflict.

Advantages:

- No database locks during reading.
- Better performance when conflicts are rare.
- Higher concurrency.
- Avoids many lock-related deadlocks.

Disadvantages:

- Updates can fail due to version conflicts.
- Requires retry or conflict-handling logic.
- Can be inefficient when conflicts happen frequently.

## 2. Pessimistic Locking

Pessimistic locking assumes that conflicts are likely. It locks the database record before modifying it.

Example:

Two users want to update the same bank account.

sql

```sql
BEGIN;

SELECT *
FROM accounts
WHERE id = 1
FOR UPDATE;

UPDATE accounts
SET balance = 900
WHERE id = 1;

COMMIT;
```

Here is what happens:

Transaction A

User 1

Executes `SELECT FOR UPDATE`.

Record lockedTransaction B

User 2

Tries to update the same record.

Waits for the lockTransaction A

Updates balance to 900 and commits.

Lock releasedTransaction B

Gets the lock and can now proceed using the latest committed data.

Advantages:

- Prevents conflicting concurrent updates while the lock is held.
- Suitable for highly contested data.
- Avoids optimistic version conflicts and retries.

Disadvantages:

- Transactions may wait for locks.
- Can cause deadlocks.
- Reduces concurrency.
- Long-running transactions can impact performance.

## 3. Key Differences

| Feature | Optimistic Locking | Pessimistic Locking |
| --- | --- | --- |
| Approach | Check conflicts later | Prevent conflicts upfront |
| Locking | No lock during read | Acquires locks |
| Concurrency | Generally higher | Generally lower |
| Performance | Good for low conflicts | Good for high contention |
| Conflicts | Detected during update | Other transactions wait |
| Deadlocks | Less likely from row locking | Possible |
| Implementation | Version/timestamp | Database locks |
| Retry handling | Usually required | Usually not required for lock conflicts |

## 4. Real-world Use Cases

| Scenario | Recommended approach |
| --- | --- |
| User profile updates | Optimistic |
| Product description updates | Optimistic |
| E-commerce inventory | Depends on contention |
| Bank account transfers | Pessimistic or atomic updates |
| Seat booking | Pessimistic or atomic conditional updates |
| Collaborative document editing | Optimistic |
| High-contention financial records | Pessimistic |

## 5. Implementation in Spring Boot / JPA

Optimistic locking using `@Version`:

java

```java
@Entity
public class Account {

    @Id
    private Long id;

    private double balance;

    @Version
    private Long version;
}
```

JPA automatically checks the version during updates.

If another transaction has modified the record, JPA throws an `OptimisticLockException` (often wrapped by Spring in an appropriate persistence exception).

Pessimistic locking using `@Lock`:

java

```java
public interface AccountRepository
        extends JpaRepository<Account, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdForUpdate(Long id);
}
```

Usage:

java

```java
@Transactional
public void updateBalance(Long id, double balance) {

    Account account = repository
            .findByIdForUpdate(id)
            .orElseThrow();

    account.setBalance(balance);
}
```

The database acquires a write lock on the selected record and holds it until the transaction completes.

## 6. Which One Should You Choose?

Choose Optimistic Locking when:

- Multiple users read the same data.
- Updates are relatively infrequent.
- Conflicts are rare.
- You want better concurrency.

Best for low-contention workloadsChoose Pessimistic Locking when:

- Multiple transactions frequently update the same record.
- Conflicts are expensive.
- Transactions need exclusive access to a record.
- Waiting is preferable to retrying.

Best for high-contention workloads

## 7. Interview Question: What happens if two users update the same record simultaneously?

Optimistic locking:

1. Both users read version 1.
2. User A updates successfully, changing version to 2.
3. User B attempts an update using version 1.
4. The update fails because the version no longer matches.
5. User B must reload the latest data and retry if appropriate.

Pessimistic locking:

1. User A acquires a lock.
2. User B tries to access the locked record for an update and waits.
3. User A updates and commits.
4. The lock is released.
5. User B proceeds.

My interview tip: Remember this simple statement:

> Optimistic locking detects conflicts, whereas pessimistic locking prevents concurrent modifications by acquiring locks.

One important follow-up question interviewers often ask is: How do you implement optimistic and pessimistic locking in Spring Boot with Hibernate, and what happens internally at the SQL level?