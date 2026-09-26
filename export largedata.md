For **millions of records**, the key HLD principle is: **never load the entire dataset into Node.js memory**. Use a streaming/batch-based export pipeline.

 ## High-level architecture

```
Client
  |
  | POST /exports
  v
API Server (Node.js)
  |
  | Create export job
  v
Job Queue (Redis / SQS / Kafka)
  |
  v
Export Worker(s) - Node.js
  |
  +----> Database
  |       |
  |       | Cursor / keyset pagination
  |       v
  |     Millions of rows
  |
  | Stream rows
  v
CSV Transform
  |
  | Stream
  v
Object Storage (S3 / GCS / Azure Blob)
  |
  v
Download URL
```

 ## Recommended flow

 ### 1\. Client creates an export

```
POST /exports
```

 Response immediately:

```
{
  "exportId": "exp_123",
  "status": "QUEUED"
}
```

 Don't keep the HTTP request open while generating the CSV.

---

 ### 2\. Put export job on a queue

 For example:

```
export_queue
    |
    +-- worker-1
    +-- worker-2
    +-- worker-3
```

 A queue gives you:

 - retries
- controlled concurrency
- protection against API traffic affecting exports
- horizontal scaling
- job status tracking

---

 ### 3\. Worker streams data from DB

 Avoid:

```
const rows = await db.query("SELECT * FROM users");
```

 For millions of rows, this can consume huge amounts of memory.

 Prefer a **database cursor/stream** or **keyset pagination**.

 For example:

```
SELECT id, name, email, created_at
FROM users
WHERE id > ?
ORDER BY id
LIMIT 10000;
```

 Then:

```
id > 0
   ↓
10,000 rows
   ↓
CSV
   ↓
id > 10,000
   ↓
10,000 rows
   ↓
CSV
   ↓
...
```

 Keyset pagination is generally preferable to:

```
OFFSET 5000000 LIMIT 10000
```

 because large offsets can become increasingly expensive.

---

 ## Node.js streaming pipeline

 Conceptually:

```
Database Read Stream
        |
        v
CSV Transform
        |
        v
File/Object Storage Write Stream
```

 Example using Node streams:

```
import { pipeline } from "node:stream/promises";

await pipeline(
  databaseStream,
  csvTransform,
  storageWriteStream
);
```

 The important property is **backpressure**.

 If S3/storage is slower than the database:

```
DB ---> CSV ---> S3
 |       |        |
fast    medium   slow
             ↓
       backpressure
```

 Node should not continue accumulating millions of rows in memory.

---

 ## CSV generation

 Don't manually concatenate one giant string:

```
let csv = "";

for (...) {
  csv += `${id},${name},${email}\n`;
}
```

 Instead, transform each row:

```
DB row
  ↓
CSV serializer
  ↓
"123,John,john@example.com\n"
```

 Make sure the serializer correctly handles:

 - commas
- quotes
- newlines
- UTF-8
- null values
- dates
- special characters

 For example:

```
123,"John, Smith","john@example.com"
```

---

 # Handling very large exports

 For **10M, 50M, 100M\+ records**, I'd design it like this:

```
                         ┌───────────────┐
                         │     API       │
                         └───────┬───────┘
                                 │
                                 v
                         ┌───────────────┐
                         │    Job DB     │
                         └───────┬───────┘
                                 │
                                 v
                         ┌───────────────┐
                         │  Job Queue    │
                         └───────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    v            v            v
                 Worker 1     Worker 2     Worker 3
                    │            │            │
                    └────────────┼────────────┘
                                 │
                                 v
                              Database
                                 │
                                 v
                         Stream / Batches
                                 │
                                 v
                           CSV Generator
                                 │
                                 v
                         Object Storage
                                 │
                                 v
                         Completed Export
```

 ## Important design decision: parallelization

 You can split the export into partitions:

```
Worker 1 → IDs 1 - 5M
Worker 2 → IDs 5M - 10M
Worker 3 → IDs 10M - 15M
```

 Each worker produces:

```
part-001.csv
part-002.csv
part-003.csv
```

 Then either:

 ### Option A — merge

```
part-001.csv ─┐
part-002.csv ─┼──> final.csv
part-003.csv ─┘
```

 ### Option B — provide a ZIP

```
export.zip
 ├── part-001.csv
 ├── part-002.csv
 └── part-003.csv
```

 For extremely large exports, **multiple CSV files inside a ZIP** can be more practical than trying to create one enormous CSV.

---

 # Export job state

 Have a table like:

```
CREATE TABLE export_jobs (
    id              VARCHAR(50) PRIMARY KEY,
    status          VARCHAR(20),
    total_records   BIGINT,
    processed       BIGINT,
    file_key        VARCHAR(500),
    error_message   TEXT,
    created_at      TIMESTAMP,
    completed_at    TIMESTAMP
);
```

 States:

```
QUEUED
   ↓
PROCESSING
   ↓
COMPLETED
```

 Failure:

```
PROCESSING
   ↓
FAILED
```

 The client can query:

```
GET /exports/:id
```

 Response:

```
{
  "id": "exp_123",
  "status": "PROCESSING",
  "processed": 7200000,
  "total": 15000000,
  "percentage": 48
}
```

 Once completed:

```
{
  "id": "exp_123",
  "status": "COMPLETED",
  "downloadUrl": "..."
}
```

 Ideally, the download URL is a **short-lived signed object-storage URL**, rather than sending the entire file through your Node API.

---

 # Database considerations

 This is often the most important part of the design.

 ### Use an index

 If you're doing:

```
WHERE id > ?
ORDER BY id
LIMIT 10000
```

 `id` needs an appropriate index.

 For filtered exports:

```
WHERE tenant_id = ?
  AND created_at >= ?
  AND id > ?
ORDER BY id
LIMIT 10000
```

 you'll want an index designed around those access patterns, e.g.:

```
(tenant_id, created_at, id)
```

 The exact index depends on the query and database.

 ### Don't use `SELECT *`

 Export only required columns:

```
SELECT
    id,
    name,
    email,
    created_at
FROM users
...
```

 This reduces DB I/O, network traffic and CSV generation work.

---

 # Backpressure is critical

 A common bad architecture is:

```
DB
 ↓
fetch 1 million
 ↓
Node memory
 ↓
CSV
 ↓
S3
```

 A better architecture is:

```
DB
 ↓
small batch / cursor
 ↓
CSV transform
 ↓
S3
```

 At any point, Node might only have a relatively small amount of data buffered.

 This keeps memory roughly bounded rather than proportional to the number of records.

---

 # Failure handling

 You should assume exports **will fail occasionally**.

 For example:

```
Worker
  ↓
processed 6,200,000 rows
  ↓
DB connection lost
  ↓
worker crashes
```

 Don't restart from zero if the export is expensive.

 Store progress/checkpoints:

```
export_id
partition
last_processed_id
```

 Then resume:

```
WHERE id > last_processed_id
```

 Also make the job idempotent so retries don't accidentally produce duplicate data.

---

 # Security

 Don't expose:

```
/s3/export-123.csv
```

 as a permanent public URL.

 Instead:

```
GET /exports/exp_123/download
             |
             v
       authorize user
             |
             v
    generate signed URL
             |
             v
          S3/Blob
```

 Also validate that the requesting user is allowed to export that tenant's/data set.

---

 # What I'd choose for a production Node.js system

```
                 ┌──────────────┐
                 │   Node API   │
                 └──────┬───────┘
                        │
                        v
                 ┌──────────────┐
                 │ Redis/SQS    │
                 │ Job Queue    │
                 └──────┬───────┘
                        │
               ┌────────┴────────┐
               v                 v
        ┌──────────────┐  ┌──────────────┐
        │ Node Worker  │  │ Node Worker  │
        └──────┬───────┘  └──────┬───────┘
               │                 │
               └────────┬────────┘
                        v
                   ┌─────────┐
                   │   DB    │
                   └────┬────┘
                        │
                 cursor/keyset
                        │
                        v
                 ┌─────────────┐
                 │ CSV Stream  │
                 └──────┬──────┘
                        │
                        v
                 ┌─────────────┐
                 │ S3 / Blob   │
                 └─────────────┘
                        │
                        v
                  Signed URL
```

 ### Key HLD decisions

 | Concern | Recommendation |
| --- | --- |
| API | Create async export job |
| Queue | SQS / Redis/BullMQ / Kafka |
| DB reading | Cursor or keyset pagination |
| Batch size | Start around 5k–20k, benchmark |
| CSV | Streaming transform |
| Memory | Bounded; never hold entire export |
| Storage | S3/GCS/Azure Blob |
| Download | Signed URL |
| Progress | Persist checkpoints |
| Retry | Idempotent/resumable |
| Huge exports | Partition into multiple files |
| DB impact | Read replica if appropriate |
| Scaling | Multiple export workers |
| API timeout | Avoid long-running HTTP export requests |

If you're preparing this for a **system-design/HLD interview**, the next level is to discuss **10M+ records, DB read replicas, partitioning strategy, exactly-once/idempotency, worker concurrency, progress tracking, and how to calculate throughput/storage requirements**.