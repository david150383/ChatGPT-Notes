 ## AWS Lambda — Interview Questions & Answers

 ### 1\. What is AWS Lambda?

 **Answer:**\
 AWS Lambda is a **serverless, event-driven compute service**. You upload your code, and AWS runs it in response to events without you managing servers.

 Common triggers:

 - API Gateway
- S3
- SQS
- SNS
- EventBridge
- DynamoDB Streams
- CloudWatch/EventBridge schedules

---

 ## 2\. What is the maximum execution time of Lambda?

 **Answer:**

 > **15 minutes maximum per Lambda invocation.**

```
Minimum timeout → 1 second
Maximum timeout → 15 minutes (900 seconds)
```

 If your function needs more than 15 minutes, Lambda may not be the right choice. Consider ECS, AWS Batch, Step Functions, or another compute service depending on the workload.

 **Interview question:**\
 "Can Lambda run continuously for 1 hour?"

 **Answer:**\
 No. A single Lambda invocation can run for a maximum of **15 minutes**.

---

 ## 3\. What is Lambda concurrency?

 **Answer:**\
 Concurrency is the number of Lambda invocations that are **executing at the same time**.

 For example:

```
100 requests arrive
        ↓
100 Lambda executions
        ↓
Concurrency = 100
```

 If each invocation takes 2 seconds and 100 requests are being processed simultaneously, Lambda concurrency is approximately 100.

---

 ## 4\. What is the maximum concurrent execution in Lambda?

 This one is a **common interview trap**.

 There isn't one universal maximum that applies to every AWS account/function.

 Lambda has an **account-level regional concurrency quota**, which is **1,000 concurrent executions by default in many regions/accounts**, and it can be increased through a quota request.

 So don't simply say:

 > "Lambda supports only 1,000 concurrent requests."

 Better answer:

 > "Lambda has a regional account concurrency quota, commonly 1,000 by default, which can be increased. Function-level concurrency can also be controlled using reserved concurrency."

---

 ## 5\. What is Reserved Concurrency?

 **Answer:**\
 Reserved concurrency guarantees and limits the concurrency available to a particular Lambda function.

 Example:

```
Account concurrency = 1,000

Function A
Reserved concurrency = 200

Function B
Reserved concurrency = 300
```

 Function A cannot consume more than **200 concurrent executions**.

 It also ensures that those 200 concurrency units are reserved for that function.

 ### Important

 Reserved concurrency can be used to:

 - Prevent one function from consuming all account concurrency
- Guarantee capacity for a function
- Control maximum concurrency

---

 ## 6\. What is Provisioned Concurrency?

 **Answer:**\
 Provisioned concurrency keeps a specified number of Lambda execution environments **initialized and ready to respond**.

 It is mainly used to reduce **cold-start latency**.

 Example:

```
Provisioned Concurrency = 10

        ↓

10 Lambda environments kept ready
```

 When requests arrive, Lambda can use these warm environments instead of creating new ones.

 ### Reserved vs Provisioned Concurrency

 | Reserved | Provisioned |
| --- | --- |
| Controls/guarantees concurrency | Pre-initializes execution environments |
| Protects capacity | Reduces cold starts |
| Can limit max concurrency | Improves startup latency |
| Doesn't itself eliminate cold starts | Designed to reduce them |

**Easy memory trick:**

 > **Reserved = "How much can this function use?"**\
>  **Provisioned = "How many should be ready?"**

---

 # 7\. What is a cold start?

 **Answer:**\
 A cold start occurs when Lambda needs to create and initialize a new execution environment before running your function.

 Typical flow:

```
Request
   ↓
New Lambda environment
   ↓
Runtime initialization
   ↓
Your code initialization
   ↓
Handler executes
```

 This can add latency.

 Cold starts are particularly noticeable in latency-sensitive APIs.

---

 ## 8\. How can you reduce Lambda cold starts?

 Common approaches:

 - Provisioned Concurrency
- Reduce deployment package size
- Reduce initialization work
- Avoid unnecessarily large dependencies
- Use efficient runtimes/configuration
- Reuse connections and clients outside the handler where appropriate

 Example:

```
# Better: initialized once per execution environment

import boto3

dynamodb = boto3.resource("dynamodb")

def lambda_handler(event, context):
    # Use existing client
    pass
```

 Instead of creating expensive clients/connections on every invocation.

---

 # 9\. What is Lambda memory?

 Lambda memory can be configured from:

 > **128 MB to 10,240 MB (10 GB)**

 An important point:

 **CPU allocation increases with memory.**

 So increasing Lambda memory isn't only about giving the function more RAM—it can also give it more CPU and improve execution time.

---

 # 10\. What is Lambda ephemeral storage?

 Lambda provides temporary filesystem storage in:

```
/tmp
```

 Configurable ephemeral storage:

 > **512 MB to 10,240 MB (10 GB)**

 This is useful for temporary files, downloaded objects, processing files, etc.

 Important:

 > `/tmp` should be treated as temporary storage, not durable persistent storage.

 For persistent data, use services such as S3 or DynamoDB depending on the use case.

---

 # 11\. What is the maximum Lambda deployment package size?

 For a Lambda **.zip deployment package uploaded directly**, the maximum size is:

 > **50 MB compressed**

 For the unzipped deployment package plus layers, the limit is:

 > **250 MB**

 If your application/dependencies are larger, you can consider using a **Lambda container image**, which supports images up to:

 > **10 GB uncompressed**

---

 # 12\. What are Lambda Layers?

 **Answer:**\
 Lambda Layers allow you to package common dependencies separately from your function code.

 Example:

```
Layer
 ├── boto3/custom libraries
 ├── shared code
 └── dependencies

Lambda Function
 └── Business logic
```

 Multiple Lambda functions can use the same layer.

 Useful for:

 - Shared libraries
- Common dependencies
- Custom runtimes
- Reducing duplication

---

 # 13\. What is the Lambda execution role?

 **Answer:**\
 The execution role is an **IAM role assumed by Lambda**.

 It determines what AWS resources the Lambda function can access.

 Example:

```
Lambda
   ↓
IAM Execution Role
   ↓
DynamoDB
S3
CloudWatch
```

 For example, if Lambda needs to read from S3, the execution role needs appropriate S3 permissions.

---

 # 14\. What is the difference between execution role and resource-based policy?

 **Execution role:**

 Controls what **Lambda can do**.

```
Lambda → S3
```

 **Resource-based policy:**

 Controls who/what can **invoke Lambda**.

```
API Gateway → Lambda
S3 → Lambda
SNS → Lambda
```

 This distinction is frequently asked in AWS interviews.

---

 # 15\. What happens if Lambda throws an error?

 It depends on the invocation type and event source.

 For synchronous invocation:

```
Client
 ↓
Lambda
 ↓
Error
 ↓
Error response
```

 For asynchronous invocation, Lambda can retry failed events automatically and can use destinations or a dead-letter queue depending on the configuration/use case.

 For services such as SQS, retry behavior is driven largely by the event source mapping and SQS visibility timeout/redrive configuration.

---

 # 16\. What is synchronous vs asynchronous Lambda invocation?

 ### Synchronous

 The caller waits for the Lambda response.

```
API Gateway
    ↓
 Lambda
    ↓
 Response
```

 Common example:

 **API Gateway → Lambda**

 ### Asynchronous

 The event is submitted and the caller doesn't wait for the function's result.

```
Event
 ↓
Lambda
 ↓
Process
```

 Examples include certain S3/EventBridge integrations.

---

 # 17\. How does Lambda process SQS messages?

 Lambda polls SQS and invokes your function with batches of messages.

 Conceptually:

```
SQS
 ↓
Lambda Event Source Mapping
 ↓
Lambda
 ↓
Process batch
```

 If processing fails, messages can become visible again after the visibility timeout and be retried.

 After repeated failures, a **dead-letter queue (DLQ)** can be used through SQS redrive policies.

---

 # 18\. What is Lambda timeout?

 Timeout defines the maximum amount of time a single invocation is allowed to run.

 Example:

```
Timeout = 30 seconds
```

 If the function doesn't finish within 30 seconds:

```
Lambda starts
   ↓
30 seconds
   ↓
Timeout
   ↓
Invocation fails
```

 Maximum:

 > **900 seconds / 15 minutes**

---

 # 19\. What is Lambda versioning?

 Lambda allows you to publish immutable versions of your function.

 Example:

```
$LATEST
   ↓
Version 1
Version 2
Version 3
```

 `$LATEST` is the mutable version you're actively updating.

 Published versions are immutable.

---

 # 20\. What is a Lambda Alias?

 An alias is a pointer to a specific Lambda version.

 Example:

```
prod → Version 10
test → Version 11
```

 Aliases are useful for:

 - Production deployments
- Blue/green deployments
- Canary deployments
- Version management

---

 # 21\. What is a Lambda environment variable?

 Environment variables allow configuration to be passed to Lambda without hardcoding it into the application.

 Example:

```
DB_TABLE = users
ENV      = prod
```

 Code can read these values at runtime.

 **Important:** Don't put secrets directly into environment variables unless appropriate controls are in place; for sensitive credentials, AWS Secrets Manager or Systems Manager Parameter Store is often preferable.

---

 # 22\. How do you monitor Lambda?

 The main service is **CloudWatch**.

 Useful metrics include:

 - Invocations
- Errors
- Duration
- Throttles
- Concurrent executions
- Iterator age for applicable stream sources
- Dead-letter errors
- Init duration in relevant telemetry/logs

 You can also use:

 - CloudWatch Logs
- CloudWatch Alarms
- AWS X-Ray
- Lambda Insights

---

 # 23\. What is Lambda throttling?

 Throttling occurs when Lambda cannot accept an invocation because concurrency limits have been reached.

 Example:

```
Concurrency limit = 1,000

Current executions = 1,000

New request
    ↓
THROTTLED
```

 For synchronous invocation, the caller can receive a throttling error.

 For asynchronous/event-driven sources, retry behavior depends on the invocation model.

---

 # 24\. What is the difference between concurrency and requests per second?

 This is **very important**.

 Concurrency is about **simultaneous executions**.

 Requests per second is about **arrival/throughput rate**.

 A useful relationship is:

```
Concurrency ≈ Requests per second × Average execution duration (seconds)
```

 Example:

```
100 requests/sec
Average execution time = 2 sec

Concurrency ≈ 100 × 2
             = 200
```

 So you can have 100 requests/sec but approximately 200 concurrent executions if each request takes 2 seconds.

---

 # 25\. Scenario: Lambda is getting throttled. What would you check?

 I would check:

 1. Current concurrency
2. Account-level concurrency quota
3. Reserved concurrency
4. Provisioned concurrency
5. Function duration
6. Traffic spikes
7. Downstream service limits
8. CloudWatch `Throttles` and `ConcurrentExecutions`
9. Whether concurrency should be increased or traffic controlled

 Possible solutions:

```
Increase quota
       +
Optimize execution time
       +
Use reserved/provisioned concurrency appropriately
       +
Throttle upstream traffic
       +
Use SQS for buffering where appropriate
```

---

 # Lambda Important Limits — Quick Revision

 | Item | Important limit |
| --- | --- |
| **Maximum execution time** | **15 minutes / 900 sec** |
| Memory | **128 MB – 10,240 MB** |
| `/tmp` ephemeral storage | **512 MB – 10,240 MB** |
| Default regional concurrency | **1,000** in many accounts/regions; quota can be increased |
| Direct .zip upload | **50 MB compressed** |
| Unzipped code + layers | **250 MB** |
| Container image | **10 GB** |
| Provisioned concurrency | Used to reduce cold starts |
| Reserved concurrency | Controls/reserves function concurrency |
| Environment variables | Configuration at runtime |

**Note:** AWS quotas can vary by account, Region, invocation type, and current Lambda service limits. For an interview, the bold numbers above are the key ones to remember, but in production always verify the current AWS quota for your Region/account.

 ## Lambda Architecture to Remember

```
                         ┌── API Gateway
                         │
                         ├── S3
                         │
Event Sources ───────────┼── SQS
                         │
                         ├── EventBridge
                         │
                         └── SNS
                              ↓
                           Lambda
                              ↓
                 ┌────────────┼────────────┐
                 ↓            ↓            ↓
              DynamoDB       S3           RDS
```

 ## ⭐ Top 15 Lambda Interview Questions

 If you're short on preparation time, memorize these:

 1. What is AWS Lambda?
2. What is the **maximum Lambda execution time? → 15 minutes**
3. What is Lambda concurrency?
4. What is the default regional concurrency quota?
5. What is reserved concurrency?
6. What is provisioned concurrency?
7. Reserved vs provisioned concurrency?
8. What is a cold start?
9. How do you reduce cold starts?
10. What is Lambda timeout?
11. What is Lambda memory, and how does it affect CPU?
12. What are Lambda Layers?
13. What is an execution role?
14. What is Lambda throttling?
15. Synchronous vs asynchronous invocation?

 ### 🧠 Super-short memory sheet

```
Lambda
│
├── Max execution       → 15 min
├── Memory              → 128 MB - 10 GB
├── /tmp                → 512 MB - 10 GB
├── Default concurrency → 1,000 (common default)
├── Cold start          → New environment initialization
├── Provisioned         → Keep environments ready
├── Reserved            → Reserve/limit concurrency
├── Layer               → Shared dependencies
├── Version             → Immutable published code
├── Alias               → Pointer to version
├── IAM Role            → What Lambda can access
├── CloudWatch          → Logs + metrics
└── Throttling          → Concurrency limit reached
```

 **One especially good interview line to remember:**

 > **"Lambda concurrency is the number of executions running simultaneously, while Lambda's execution timeout is the maximum duration of one invocation. They are independent limits."**