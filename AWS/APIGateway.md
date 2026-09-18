 ## AWS API Gateway — Interview Questions & Answers

 ### 1\. What is AWS API Gateway?

 **Answer:**\
 AWS API Gateway is a fully managed service used to **create, publish, secure, monitor, and manage APIs**. It acts as a front door between clients and backend services such as:

 - AWS Lambda
- EC2 applications
- ECS/EKS services
- HTTP endpoints
- Other AWS services

 **Interview point:** API Gateway commonly works with **Lambda + DynamoDB** for serverless applications.

---

 ### 2\. What are the types of APIs supported by API Gateway?

 **Answer:**

 - **REST API** — Feature-rich and supports features such as API keys, usage plans, request validation, and more.
- **HTTP API** — Lower cost and lower latency, suitable for many straightforward HTTP APIs.
- **WebSocket API** — Used for persistent, two-way communication, such as chat applications and real-time notifications.

 **Remember:**\
 `REST → more features`\
 `HTTP → simpler/cheaper`\
 `WebSocket → real-time, bidirectional`

---

 ### 3\. What is the difference between REST API and HTTP API?

 | Feature | REST API | HTTP API |
| --- | --- | --- |
| Cost | Higher | Lower |
| Features | More features | Simpler |
| Latency | Higher | Lower |
| API Keys | Yes | Limited/different approach |
| Usage Plans | Yes | No |
| Request validation | Yes | More limited |
| JWT authorization | Supported | Strong native support |
| Typical use | Feature-rich APIs | Simple, high-volume APIs |

**Interview answer:**\
 "I would choose HTTP API when I need a simple, low-cost API, and REST API when I need advanced API management features."

---

 ### 4\. How does API Gateway integrate with Lambda?

 **Answer:**

 The typical flow is:

```
Client
   ↓
API Gateway
   ↓
Lambda
   ↓
DynamoDB / S3 / Other AWS services
```

 API Gateway receives the HTTP request and invokes Lambda. Lambda processes the request and returns a response through API Gateway.

---

 ### 5\. What is an API Gateway stage?

 **Answer:**\
 A **stage** represents a deployment environment or version of an API.

 Common stages are:

```
/dev
/test
/staging
/prod
```

 Each stage can have different configuration, throttling, variables, and deployment settings.

 **Example:**

```
https://abc123.execute-api.us-east-1.amazonaws.com/dev/users
https://abc123.execute-api.us-east-1.amazonaws.com/prod/users
```

---

 ### 6\. What are API Gateway stages and deployments?

 **Answer:**\
 A **deployment** is a snapshot of an API configuration. A **stage** points to a deployment and provides an environment through which clients access that API.

 A common deployment process is:

```
Create/Modify API
      ↓
Deploy API
      ↓
Deployment created
      ↓
Stage → Deployment
```

---

 ### 7\. What is throttling in API Gateway?

 **Answer:**\
 Throttling limits the number of requests that clients can send to an API over a period of time.

 It protects your backend from excessive traffic.

 For example:

```
Rate limit  = 1,000 requests/second
Burst       = 2,000 requests
```

 If traffic exceeds the allowed limits, API Gateway can return:

```
HTTP 429 Too Many Requests
```

---

 ### 8\. What is the difference between rate and burst?

 **Answer:**

 - **Rate** = sustained request rate.
- **Burst** = temporary spike of requests that can be handled.

 For example:

```
Rate  = 100 requests/sec
Burst = 200 requests
```

 Think of it as:

 > **Rate = normal speed**\
>  **Burst = temporary traffic spike**

---

 ### 9\. What is API Gateway authorization?

 API Gateway can control who is allowed to invoke an API.

 Common mechanisms include:

 - IAM authorization
- Lambda authorizer
- JWT authorizers, particularly with HTTP APIs
- Amazon Cognito
- API keys for usage identification/control (not authentication by themselves)

---

 ### 10\. What is a Lambda Authorizer?

 **Answer:**\
 A Lambda Authorizer is a Lambda function that performs custom authorization logic before allowing access to an API.

 Flow:

```
Client
  ↓
API Gateway
  ↓
Lambda Authorizer
  ↓
Authorized?
  ↓
Backend Lambda/API
```

 It can inspect things like:

```
Authorization header
JWT/token
Custom headers
```

 and determine whether the request should be allowed.

---

 ### 11\. What is the difference between authentication and authorization?

 **Answer:**

 **Authentication:**\
 "Who are you?"

 **Authorization:**\
 "What are you allowed to do?"

 Example:

```
Login → Authentication
Access /admin/users → Authorization
```

 This is a very common interview question.

---

 ### 12\. What is an API key in API Gateway?

 **Answer:**\
 An API key is a value that can be associated with API clients and used for **usage tracking and throttling**, typically together with usage plans.

 Important interview point:

 > **API keys should not be considered a secure authentication mechanism.**

 For authentication, use mechanisms such as IAM, Cognito/JWT, or a Lambda authorizer depending on the architecture.

---

 ### 13\. What is a Usage Plan?

 **Answer:**\
 A Usage Plan allows you to control and monitor API consumption.

 It can be associated with:

```
API
 ↓
Stage
 ↓
Usage Plan
 ↓
API Key
```

 It can define:

 - Throttling
- Quotas
- API key associations

---

 ### 14\. What is CORS?

 **Answer:**\
 **CORS = Cross-Origin Resource Sharing.**

 It controls whether a browser-based application from one origin can make requests to an API hosted on another origin.

 Example:

```
Frontend:
https://myapp.com

API:
https://api.myapp.com
```

 API Gateway can be configured to return appropriate CORS headers such as:

```
Access-Control-Allow-Origin
Access-Control-Allow-Methods
Access-Control-Allow-Headers
```

---

 ### 15\. What is an API Gateway resource?

 **Answer:**\
 A resource represents a URL path.

 For example:

```
/users
/users/{id}
/orders
/orders/{id}
```

 `{id}` is a **path parameter**.

---

 ### 16\. What is an API Gateway method?

 **Answer:**\
 A method represents an HTTP operation on a resource.

 Examples:

```
GET    /users
POST   /users
GET    /users/{id}
PUT    /users/{id}
DELETE /users/{id}
```

---

 ### 17\. What is a path parameter?

 **Answer:**\
 A path parameter is a variable part of the URL.

 Example:

```
GET /users/{id}
```

 Request:

```
GET /users/123
```

 Here:

```
id = 123
```

---

 ### 18\. What is a query string parameter?

 **Answer:**\
 Query parameters appear after `?`.

 Example:

```
GET /users?status=active&page=2
```

 Here:

```
status = active
page   = 2
```

---

 ### 19\. What is API Gateway integration?

 **Answer:**\
 Integration defines **what API Gateway calls after receiving a request**.

 Examples include:

```
API Gateway → Lambda
API Gateway → HTTP endpoint
API Gateway → AWS service
API Gateway → Mock response
```

---

 ### 20\. What is a proxy integration?

 **Answer:**\
 With proxy integration, API Gateway forwards much of the incoming request information to the backend and passes the backend response back to the client.

 For Lambda, this is commonly called **Lambda proxy integration**.

 Conceptually:

```
HTTP Request
     ↓
API Gateway
     ↓
Lambda event
     ↓
Lambda response
     ↓
API Gateway
     ↓
HTTP Response
```

---

 ### 21\. What is request validation?

 **Answer:**\
 Request validation allows API Gateway to validate incoming requests before sending them to the backend.

 It can validate things such as:

 - Required parameters
- Request body structure/schema

 This can reduce unnecessary Lambda invocations and backend processing.

---

 ### 22\. How can you secure API Gateway?

 **Answer:**\
 Several approaches can be combined:

 - HTTPS/TLS
- IAM authorization
- Cognito/JWT
- Lambda authorizers
- API keys and usage plans
- AWS WAF
- Throttling
- Resource policies
- CloudWatch monitoring/logging

 A good interview response is:

 > "Security should be layered. I would use authentication/authorization appropriate to the client, TLS, throttling, WAF where needed, and least-privilege IAM policies."

---

 ### 23\. What is AWS WAF with API Gateway?

 **Answer:**\
 AWS WAF can help protect APIs from common web attacks and unwanted traffic.

 For example, you can configure rules for:

 - IP addresses
- Rate-based rules
- SQL injection patterns
- Cross-site scripting patterns
- Geographic restrictions

 Typical architecture:

```
Client
  ↓
CloudFront / API Gateway
  ↓
AWS WAF
  ↓
Backend
```

---

 ### 24\. How do you monitor API Gateway?

 **Answer:**\
 The primary AWS service is **Amazon CloudWatch**.

 You can monitor things such as:

 - Request count
- Latency
- Integration latency
- 4XX errors
- 5XX errors
- Throttling
- Logs

 Example:

```
Client
  ↓
API Gateway
  ↓
CloudWatch Logs/Metrics
```

---

 ### 25\. What is the difference between 4XX and 5XX errors?

 **Answer:**

 **4XX:** Usually indicates a client/request-side problem.

 Examples:

```
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
429 Too Many Requests
```

 **5XX:** Usually indicates a server/backend-side problem.

 Examples:

```
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
```

---

 ## Scenario-Based Interview Questions

 ### 26\. Your API is receiving too many requests. What would you do?

 **Answer:**

 I would consider:

 1. API Gateway throttling
2. Usage plans where applicable
3. AWS WAF rate-based rules
4. CloudWatch metrics to understand traffic
5. Backend scaling
6. Caching where appropriate
7. Architectural improvements such as asynchronous processing

---

 ### 27\. Lambda is getting invoked unnecessarily for invalid requests. How can you reduce this?

 **Answer:**

 Use **API Gateway request validation** where supported.

 For example:

```
Client
 ↓
API Gateway
 ↓
Validate request
 ↓
Invalid → Reject
Valid → Lambda
```

 This prevents invalid requests from unnecessarily reaching Lambda.

---

 ### 28\. Your API works in Postman but fails from a browser. What would you check?

 **Answer:**\
 I would first check **CORS**.

 I'd verify:

 - `Access-Control-Allow-Origin`
- Allowed methods
- Allowed headers
- OPTIONS/preflight handling
- API Gateway CORS configuration
- Whether authentication headers are permitted

 Postman generally doesn't enforce browser CORS rules, which explains why the behavior can differ.

---

 ### 29\. How would you implement `/users/{id}` using API Gateway and Lambda?

 **Answer:**

 Define:

```
Resource:
 /users/{id}

Method:
 GET
```

 Then configure:

```
API Gateway
      ↓
GET /users/{id}
      ↓
Lambda
      ↓
Read user from DynamoDB
```

 The Lambda receives the path parameter and uses it to retrieve the user.

---

 ### 30\. How would you design a production API using API Gateway?

 **Answer:**

 A reasonable architecture could be:

```
                 ┌── Cognito/JWT
                 │
Client → API Gateway → Lambda → DynamoDB
             │
             ├── WAF
             ├── Throttling
             ├── CloudWatch
             └── Custom Domain
```

 Depending on requirements, I would also consider:

 - Separate dev/test/prod stages
- Infrastructure as Code
- Custom domain
- TLS certificate
- Authentication/authorization
- Logging and metrics
- Alarms
- Rate limiting
- Caching
- Least-privilege IAM

---

 # Short Notes for Quick Revision

 ### API Gateway flow

```
Client
 ↓
API Gateway
 ↓
Authorization
 ↓
Validation
 ↓
Integration
 ↓
Backend
 ↓
Response
```

 ### Important terms

 | Term | Remember |
| --- | --- |
| Resource | URL/path |
| Method | GET/POST/PUT/DELETE |
| Stage | Environment/version |
| Deployment | Snapshot of API configuration |
| Integration | Backend connection |
| Authorizer | Access-control logic |
| API Key | Usage identification/control |
| Usage Plan | Throttling + quota + API key association |
| CORS | Browser cross-origin access |
| Throttling | Limits request rate |
| WAF | Web attack/traffic protection |
| CloudWatch | Logs, metrics, monitoring |

### HTTP status codes

```
200 → Success
201 → Created
400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
429 → Too Many Requests
500 → Internal Server Error
502 → Bad Gateway
504 → Gateway Timeout
```

 ### Most important interview differences

 **REST API vs HTTP API**

```
REST API → Feature-rich
HTTP API  → Simpler + cheaper + lower latency
```

 **Authentication vs Authorization**

```
Authentication → Who are you?
Authorization  → What can you access?
```

 **Rate vs Burst**

```
Rate  → Sustained traffic
Burst → Temporary traffic spike
```

 **API Key vs Authorization**

```
API Key → Usage tracking/throttling
Auth    → Determines whether client is allowed
```

 ## 10 Questions I'd Definitely Prepare

 If you're preparing for an AWS interview, make sure you can answer these without notes:

 1. What is API Gateway?
2. REST API vs HTTP API?
3. How does API Gateway integrate with Lambda?
4. What are stages and deployments?
5. What is throttling?
6. What are Lambda authorizers?
7. API key vs authentication?
8. What is CORS and why does it fail in browsers?
9. How do you secure API Gateway?
10. How do you monitor and troubleshoot 4XX/5XX errors?

 If you want, I can also give you a **30-question AWS API Gateway interview set from beginner → intermediate → advanced, including scenario-based questions and sample answers suitable for 2–5 years of experience**.

 30-question AWS API Gateway interview set from beginner → intermediate → advanced, including scenario-based questions and sample answers suitable for 2–5 years of experience