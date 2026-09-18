Here is a cheat sheet and reference guide for SQS and SNS parameters, core settings, and architectural gotchas.

---

### Amazon SQS (Simple Queue Service)

**Queue Configuration Parameters**

* **`VisibilityTimeout`** (Default: `30s`, Max: `12h`):
* How long a message is hidden from other workers after being read.
* Extend it dynamically via `ChangeMessageVisibility` if processing runs long (heartbeating).


* **`MessageRetentionPeriod`** (Default: `4 days`, Max: `14 days`):
* How long unconsumed messages survive in the queue before auto-deletion.


* **`DeliveryDelay` / `DelaySeconds**` (Default: `0s`, Max: `15m`):
* Delay before a newly sent message becomes visible to consumers.


* **`ReceiveMessageWaitTimeSeconds`** (Default: `0s`, Max: `20s`):
* **Long Polling** threshold. Setting to `1-20s` reduces empty receives, API calls, and AWS costs.


* **`RedrivePolicy`** (Dead Letter Queue):
* `deadLetterTargetArn`: Target DLQ ARN.
* `maxReceiveCount`: Failed receives/timeouts allowed before moving the message to DLQ.


* **`FifoQueue`** (`true`/`false`):
* Queue name must end with `.fifo`. Enables strict in-order delivery and de-duplication.


* **`ContentBasedDeduplication`** (`true`/`false`):
* Hashes message body (SHA-256) inside the 5-minute deduplication window (FIFO only).



**SDK API Commands & Parameters**

* **`SendMessageCommand`**:
* `QueueUrl`: Full endpoint URL of the queue.
* `MessageBody`: String/JSON payload (Max 256 KB).
* `MessageGroupId` *(FIFO only)*: Groups related messages to ensure strict internal ordering.
* `MessageDeduplicationId` *(FIFO only)*: 5-minute sliding window unique token.
* `MessageAttributes`: Key-value metadata attached to the message.


* **`ReceiveMessageCommand`**:
* `MaxNumberOfMessages`: Up to `10` messages per batch.
* `WaitTimeSeconds`: Enables long polling per request.
* `VisibilityTimeout`: Overrides the queue default for this specific pull.


* **`DeleteMessageCommand`**:
* `ReceiptHandle`: The ephemeral token returned by `ReceiveMessage` (NOT the `MessageId`).



---

### Amazon SNS (Simple Notification Service)

**Topic Configuration Parameters**

* **`TopicArn`**:
* Global address used for publishing and subscriptions.


* **`FifoTopic`** (`true`/`false`):
* Topic name must end in `.fifo`.
* Preserves message group order; can **only** deliver to SQS FIFO queues.


* **`ContentBasedDeduplication`** (`true`/`false`):
* Auto-generates deduplication tokens based on payload hashing.



**Subscription Settings & Attributes**

* **`Protocol`**:
* Supported: `sqs`, `lambda`, `http`/`https`, `email`, `sms`, `application` (mobile push).


* **`RawMessageDelivery`** (`true`/`false`):
* `false` (default): Payload is wrapped in the SNS JSON envelope (`{ "Type": "Notification", "Message": "..." }`).
* `true`: Delivers exact string payload directly to SQS (stripping the SNS envelope).


* **`FilterPolicyScope`**:
* `MessageAttributes` (default, faster, evaluates outer headers).
* `MessageBody` (evaluates keys directly inside the JSON body).


* **`FilterPolicy`**:
* JSON rules defining what this subscriber receives (e.g., `{"eventType": ["ORDER_PLACED"]}`).


* **`RedrivePolicy`** (SNS Subscription DLQ):
* Points to an SQS queue to capture failed push deliveries (e.g., subscriber endpoint down or access denied).



**SDK API Commands & Parameters**

* **`PublishCommand`**:
* `TopicArn`: ARN of destination topic.
* `Message`: String/JSON payload.
* `MessageAttributes`: Outer metadata headers (used for subscription filtering).
* `MessageGroupId` *(FIFO only)*: Order guarantee boundary.
* `MessageDeduplicationId` *(FIFO only)*: Duplicate suppression token.



---

### Key Limits & Gotchas

* **Payload Limit:** Both SQS and SNS have a **256 KB** hard limit. For larger files, use the **Extended Client Library** (stores body in S3 and sends the pointer reference).
* **SNS Envelope Gotcha:** When `RawMessageDelivery: false`, your worker must do a double `JSON.parse()`:
```javascript
const snsEnvelope = JSON.parse(sqsMessage.Body);
const data = JSON.parse(snsEnvelope.Message);

```


* **Permissions (Queue Policy):** When subscribing SQS to SNS in real AWS, SQS must have a resource policy allowing `sns.amazonaws.com` to run `sqs:SendMessage` with a `SourceArn` check on the topic.
* **FIFO Boundary Rule:** SNS FIFO topics can **never** deliver to Standard SQS queues or HTTP/Email endpoints. Endpoints must be SQS FIFO queues.