 # AWS Basics — Interview Notes

 ## 1\. What is AWS?

 **AWS (Amazon Web Services)** is a cloud platform that provides services for:

 - Compute → EC2, Lambda
- Storage → S3, EBS
- Database → RDS, DynamoDB
- Networking → VPC, Route 53, API Gateway
- Security → IAM, KMS, WAF
- Monitoring → CloudWatch
- Messaging → SQS, SNS

 ### Easy definition

 > AWS provides on-demand IT infrastructure and managed services over the internet, where you generally pay based on usage.

---

 # 2\. AWS Region

 A **Region** is a separate geographical area containing multiple AWS Availability Zones.

 Examples:

```
ap-south-1       → Mumbai
ap-south-2       → Hyderabad
us-east-1        → N. Virginia
us-west-2        → Oregon
eu-west-1        → Ireland
```

 Think:

 > **Region = geographical location**

 For example:

```
India
  ↓
ap-south-1 / ap-south-2
```

 ### Interview question

 **Q: Why would you choose a particular AWS Region?**

 Consider:

 - User proximity / latency
- Service availability
- Pricing
- Data residency/compliance
- Disaster recovery requirements

---

 # 3\. Availability Zone (AZ)

 An **Availability Zone** is an isolated location within an AWS Region.

 A Region generally contains **multiple AZs**.

 Example:

```
AWS Region: ap-south-1

       Region
    ┌────┼────┐
    ↓    ↓    ↓
   AZ-a AZ-b AZ-c
```

 The AZs are designed to be isolated from failures in other AZs while being connected through AWS networking.

 ### Easy memory

 > **Region = city/area**\
>  **AZ = separate data-center location within that Region**

 Don't describe an AZ simply as "a data center"; an AZ can consist of one or more discrete data centers.

---

 # 4\. Region vs Availability Zone

 | Region | Availability Zone |
| --- | --- |
| Geographic area | Isolated location within a Region |
| Contains multiple AZs | Belongs to one Region |
| Example: Mumbai Region | Example: AZ within Mumbai |
| Used for geographic placement | Used for high availability/fault isolation |

### Interview answer

 > "A Region is a geographic AWS location, while an Availability Zone is an isolated location within that Region. Deploying across multiple AZs improves availability."

---

 # 5\. What is ARN?

 **ARN = Amazon Resource Name.**

 It is a unique identifier used to identify AWS resources.

 General structure:

```
arn:partition:service:region:account-id:resource
```

 Example:

```
arn:aws:s3:::my-bucket
```

 Another example:

```
arn:aws:lambda:ap-south-1:123456789012:function:my-function
```

 ### Break it down

```
arn
 ↓
aws
 ↓
lambda
 ↓
ap-south-1
 ↓
123456789012
 ↓
my-function
```

 ### Easy memory

 > **ARN = unique identity/address of an AWS resource**

---

 # 6\. ARN — Important Interview Point

 Not every ARN contains every component.

 For example, S3 bucket ARNs don't include a Region:

```
arn:aws:s3:::my-bucket
```

 Whereas Lambda ARNs contain Region and account information:

```
arn:aws:lambda:ap-south-1:123456789012:function:my-function
```

---

 # 7\. AWS Account ID

 An AWS account has a unique **12-digit account ID**.

 Example:

```
123456789012
```

 It is frequently present in ARNs.

```
arn:aws:lambda:ap-south-1:123456789012:function:my-function
                         ↑
                     Account ID
```

---

 # 8\. IAM

 **IAM = Identity and Access Management.**

 It controls:

 > **Who can access what, and what actions they can perform.**

 Important IAM concepts:

```
IAM
├── User
├── Group
├── Role
├── Policy
└── Permission
```

---

 # 9\. IAM User

 An IAM User represents a specific identity, traditionally for a person or application requiring long-term credentials.

 Example:

```
Developer
   ↓
IAM User
   ↓
Permissions
   ↓
S3 / EC2 / etc.
```

 For human access, AWS generally recommends using **federated/identity-center-based access** rather than creating long-lived IAM users wherever possible.

---

 # 10\. IAM Group

 A Group is a collection of IAM users.

 Example:

```
Developers
 ├── User A
 ├── User B
 └── User C

      ↓
  Same policies
```

 Groups make permission management easier.

---

 # 11\. IAM Role

 An IAM Role is an identity with permissions that can be **assumed** by trusted entities.

 Common example:

```
Lambda
   ↓
Assume IAM Role
   ↓
Permission to access S3
```

 Other examples:

 - EC2 assuming a role
- Lambda assuming a role
- Users assuming roles
- Cross-account access

 ### Easy interview definition

 > "An IAM role provides temporary credentials and permissions to a trusted principal."

---

 # 12\. IAM Policy

 A policy is a JSON document that defines permissions.

 Example:

```
{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::my-bucket/*"
}
```

 Meaning:

 > Allow reading objects from `my-bucket`.

---

 # 13\. Authentication vs Authorization

 Very common interview question.

 **Authentication:**

 > Who are you?

 **Authorization:**

 > What are you allowed to do?

 Example:

```
Login
 ↓
Authentication

Access S3 bucket
 ↓
Authorization
```

---

 # 14\. VPC

 **VPC = Virtual Private Cloud.**

 It is your logically isolated network inside AWS.

 Think of it as:

 > **Your private network in AWS.**

 Example:

```
AWS
└── VPC
    ├── Subnet
    ├── Subnet
    ├── Route Table
    ├── Internet Gateway
    └── Security Groups
```

---

 # 15\. Subnet

 A subnet is a range of IP addresses inside a VPC.

 Example:

```
VPC
10.0.0.0/16
   │
   ├── Public Subnet
   │   10.0.1.0/24
   │
   └── Private Subnet
       10.0.2.0/24
```

 ### Important

 A subnet exists in **one Availability Zone**.

 A VPC can span multiple AZs.

---

 # 16\. Public vs Private Subnet

 ### Public subnet

 A subnet is considered public when its route table has a route to an **Internet Gateway**.

 Typical resources:

```
Internet
   ↓
Internet Gateway
   ↓
Public Subnet
   ↓
Load Balancer
```

 ### Private subnet

 Doesn't have a direct route to an Internet Gateway.

 Typical resources:

```
Private Subnet
     ↓
   NAT Gateway
     ↓
Internet
```

 Commonly used for:

 - Application servers
- Databases
- Internal services

---

 # 17\. Internet Gateway

 An **Internet Gateway (IGW)** allows resources in a VPC to communicate with the public internet when routing and public addressing are configured appropriately.

 Typical:

```
Internet
   ↓
Internet Gateway
   ↓
VPC
   ↓
Public Subnet
```

---

 # 18\. NAT Gateway

 **NAT = Network Address Translation.**

 A NAT Gateway allows resources in private subnets to make **outbound** connections to the internet without allowing unsolicited inbound internet connections to those private resources.

 Example:

```
Private EC2
    ↓
NAT Gateway
    ↓
Internet
```

 ### Easy difference

```
Internet Gateway → Public internet connectivity
NAT Gateway     → Private subnet outbound internet access
```

---

 # 19\. Security Group

 A Security Group acts as a **stateful virtual firewall** for resources such as EC2 instances and certain other AWS resources.

 Example:

```
Security Group

Inbound:
22  → SSH
80  → HTTP
443 → HTTPS
```

 Important:

 - Stateful
- Supports allow rules
- No explicit deny rules

---

 # 20\. Network ACL

 **NACL = Network Access Control List.**

 It works at the **subnet level**.

 Important:

 - Stateless
- Supports allow and deny rules
- Rules are evaluated in order

 ### Security Group vs NACL

 | Security Group | NACL |
| --- | --- |
| Resource level | Subnet level |
| Stateful | Stateless |
| Allow rules | Allow + deny |
| Return traffic automatically allowed | Return traffic must be explicitly allowed |

**Memory trick:**

 > **SG = Stateful + resource**\
>  **NACL = Network/subnet \+ stateless**

---

 # 21\. S3

 **S3 = Simple Storage Service.**

 Object storage used for:

 - Images
- Videos
- Backups
- Logs
- Documents
- Static websites
- Data lakes

 Basic structure:

```
S3
└── Bucket
    ├── object.jpg
    ├── file.pdf
    └── data.json
```

 ### Important terms

```
Bucket → Container
Object → File/data
Key    → Object's name/path identifier
```

---

 # 22\. EC2

 **EC2 = Elastic Compute Cloud.**

 Provides virtual servers in AWS.

 You choose things such as:

 - Instance type
- OS/AMI
- CPU/memory characteristics
- Storage
- Network configuration

 Think:

 > **EC2 = Virtual server**

---

 # 23. AMI

 **AMI = Amazon Machine Image.**

 An AMI is a template used to launch EC2 instances.

 It can contain:

 - Operating system
- Applications
- Configuration

 Example:

```
AMI
 ↓
Launch
 ↓
EC2 Instance
```

---

 # 24\. EBS

 **EBS = Elastic Block Store.**

 Provides persistent block storage for EC2.

 Think:

```
EC2
 ↓
EBS volume
```

 Similar conceptually to a virtual hard disk.

---

 # 25\. RDS

 **RDS = Relational Database Service.**

 Managed relational databases.

 Examples include:

 - PostgreSQL
- MySQL
- MariaDB
- Oracle
- SQL Server
- Aurora

 AWS handles many operational tasks such as provisioning, backups, patching, and failover options depending on the configuration.

---

 # 26\. DynamoDB

 DynamoDB is a **managed NoSQL database**.

 It provides key-value and document data models.

 Example:

```
UserId     Name
------     ----
101        John
102        David
```

 Key characteristics:

 - Serverless
- Highly scalable
- Low-latency
- NoSQL

---

 # 27\. CloudWatch

 **CloudWatch = AWS monitoring and observability service.**

 Used for:

 - Metrics
- Logs
- Alarms
- Dashboards
- Monitoring AWS resources/applications

 Example:

```
Lambda
  ↓
CloudWatch
  ├── Logs
  ├── Metrics
  └── Alarms
```

---

 # 28. CloudTrail

 **CloudTrail records AWS API activity.**

 For example:

```
Who deleted an S3 bucket?
Who changed an IAM policy?
Who stopped an EC2 instance?
```

 CloudTrail helps answer:

 > **Who did what, when, and through which API/action?**

 ### CloudWatch vs CloudTrail

```
CloudWatch → Monitor
CloudTrail  → Audit
```

 This is a **very common interview question**.

---

 # 29\. Route 53

 Route 53 is AWS's **DNS and domain service**.

 Example:

```
www.example.com
       ↓
    Route 53
       ↓
Load Balancer / CloudFront / other endpoint
```

 It can provide:

 - DNS
- Domain registration
- Health checks
- Routing policies

---

 # 30\. Elastic Load Balancer (ELB)

 A Load Balancer distributes incoming traffic across backend resources.

 Example:

```
Users
  ↓
Load Balancer
  ├── EC2
  ├── EC2
  └── EC2
```

 Common types:

 - **ALB** → Application Load Balancer
- **NLB** → Network Load Balancer
- **GWLB** → Gateway Load Balancer

---

 # 31\. Auto Scaling

 Auto Scaling automatically adjusts compute capacity based on demand.

 Example:

```
Low traffic
   ↓
2 EC2 instances

High traffic
   ↓
5 EC2 instances
```

 The goal is to maintain application availability while controlling costs.

---

 # 32\. SNS vs SQS

 Another extremely common interview question.

 ### SNS

 **Publish/Subscribe messaging.**

```
Publisher
    ↓
   SNS
  ↙   ↘
SQS   Lambda
```

 ### SQS

 **Message queue.**

```
Producer
   ↓
  SQS
   ↓
Consumer
```

 ### Easy memory

 > **SNS = Push/fan-out**\
>  **SQS = Queue/buffer**

---

 # 33\. Synchronous vs Asynchronous

 ### Synchronous

 Caller waits for response.

```
Client → API → Lambda → Response
```

 ### Asynchronous

 Caller doesn't wait for processing to finish.

```
Event → Queue/Event service → Processing
```

---

 # 34\. Scalability vs Availability

 ### Scalability

 Ability to handle increasing workload.

```
100 users
 ↓
1,000 users
 ↓
100,000 users
```

 ### Availability

 Ability of the system to remain accessible/operational.

```
AZ-1 ❌
 ↓
AZ-2 ✅
 ↓
Application remains available
```

---

 # 35\. High Availability

 High availability means designing systems to continue operating despite failures.

 Example:

```
             Load Balancer
              /        \
             ↓          ↓
           AZ-1        AZ-2
          EC2          EC2
```

 If one AZ has a problem, traffic can potentially be served by the other AZ.

---

 # 36\. Fault Tolerance

 Fault tolerance means the system can continue operating despite component failures.

 The concepts overlap, but fault tolerance generally implies a stronger ability to continue without interruption or with minimal impact.

---

 # 37\. Horizontal vs Vertical Scaling

 ### Vertical scaling

 Increase the size of a machine.

```
2 CPU / 4 GB
     ↓
8 CPU / 32 GB
```

 ### Horizontal scaling

 Add more machines.

```
1 EC2
 ↓
5 EC2 instances
```

 ### Memory trick

 > **Vertical = bigger**\
>  **Horizontal = more**

---

 # 38\. Stateless vs Stateful

 ### Stateless

 Each request can be processed independently.

```
Request → Server
Request → Any Server
```

 Good for horizontal scaling.

 ### Stateful

 The server maintains information about previous interactions.

 Example:

```
User session stored locally on Server A
```

 If the next request goes to Server B, the session may not be available unless shared/externalized.

 Common AWS solution:

```
Application
   ↓
DynamoDB / ElastiCache
   ↓
Shared state
```

---

 # 39\. AWS Shared Responsibility Model

 AWS is responsible for **security of the cloud**.

 You are responsible for **security in the cloud**, depending on the service.

 Example:

```
AWS
 ↓
Physical data centers
Hardware
Infrastructure

Customer
 ↓
IAM permissions
Data
Application configuration
Security groups
OS patching on EC2
```

 The exact responsibility depends on the service.

 For example, with Lambda, AWS manages much more of the underlying infrastructure than with EC2.

---

 # 40\. Multi-AZ vs Multi-Region

 ### Multi-AZ

 Deploy across multiple Availability Zones in the same Region.

```
Region
├── AZ-1 → App
└── AZ-2 → App
```

 Primarily for:

 - High availability
- Fault isolation

 ### Multi-Region

 Deploy across multiple AWS Regions.

```
Mumbai
   +
Singapore
```

 Useful for:

 - Disaster recovery
- Geographic latency
- Regulatory requirements
- Business continuity

---

 # ⭐ AWS Basics — Must-Memorize Table

 | Term | Simple meaning |
| --- | --- |
| **AWS** | Cloud platform |
| **Region** | Geographic AWS location |
| **AZ** | Isolated location within a Region |
| **ARN** | Unique AWS resource identifier |
| **Account ID** | 12-digit AWS account identifier |
| **IAM** | Identity and access management |
| **Role** | Identity that can be assumed |
| **Policy** | Defines permissions |
| **VPC** | Private virtual network |
| **Subnet** | IP range inside VPC |
| **IGW** | Internet connectivity for VPC |
| **NAT Gateway** | Outbound internet access for private subnets |
| **Security Group** | Stateful resource-level firewall |
| **NACL** | Stateless subnet-level firewall |
| **EC2** | Virtual server |
| **AMI** | EC2 launch template/image |
| **EBS** | Block storage |
| **S3** | Object storage |
| **RDS** | Managed relational database |
| **DynamoDB** | Managed NoSQL database |
| **CloudWatch** | Monitoring/observability |
| **CloudTrail** | API auditing |
| **Route 53** | DNS/domain service |
| **ELB** | Load balancing |
| **SNS** | Pub/sub messaging |
| **SQS** | Message queue |
| **Lambda** | Serverless compute |

## 🧠 30-Second AWS Revision

```
AWS
│
├── Region
│    └── Availability Zones
│
├── Networking
│    ├── VPC
│    ├── Subnet
│    ├── Route Table
│    ├── Internet Gateway
│    ├── NAT Gateway
│    ├── Security Group
│    └── NACL
│
├── Compute
│    ├── EC2
│    └── Lambda
│
├── Storage
│    ├── S3 → Object
│    └── EBS → Block
│
├── Database
│    ├── RDS → SQL
│    └── DynamoDB → NoSQL
│
├── Security
│    ├── IAM
│    ├── KMS
│    └── WAF
│
├── Monitoring
│    ├── CloudWatch → Monitor
│    └── CloudTrail → Audit
│
└── Messaging
     ├── SNS → Pub/Sub
     └── SQS → Queue
```

 ### 🔥 The 10 AWS basics questions interviewers love

 1. **What is a Region?**
2. **What is an Availability Zone?**
3. **Region vs AZ?**
4. **What is an ARN?**
5. **What is IAM and what is an IAM Role?**
6. **Security Group vs NACL?**
7. **Public vs Private Subnet?**
8. **Internet Gateway vs NAT Gateway?**
9. **CloudWatch vs CloudTrail?**
10. **SNS vs SQS?**

 If you can answer these **plus Lambda and API Gateway questions from above**, you already have a solid foundation for most **AWS developer / backend developer interviews**.