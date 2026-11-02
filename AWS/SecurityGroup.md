An AWS EC2 Security Group acts as a virtual firewall that controls inbound and outbound traffic to your EC2 instances.

For learning and production environments, you should follow the principle of least privilege: allow only the required ports and trusted source IPs.

## 1. Basic EC2 Security Group settings

Suppose you are deploying a Node.js application on an EC2 instance.

Example: `web-server-sg`

Inbound rules

Recommended baseline

| Type       | Protocol | Port | Source               | Purpose        |
| ---------- | -------- | ---- | -------------------- | -------------- |
| SSH        | TCP      | 22   | Your public IP `/32` | Server access  |
| HTTP       | TCP      | 80   | `0.0.0.0/0`          | Website        |
| HTTPS      | TCP      | 443  | `0.0.0.0/0`          | Secure website |
| Custom TCP | TCP      | 3000 | ALB Security Group   | Node.js app    |

Outbound rules

| Type        | Protocol | Port | Destination |
| ----------- | -------- | ---- | ----------- |
| All traffic | All      | All  | `0.0.0.0/0` |

The outbound rule above is the common AWS default. You can restrict it further depending on application requirements.

## 2. Understand each port

| Port  | Service    | When to use                 |
| ----- | ---------- | --------------------------- |
| 22    | SSH        | Linux server administration |
| 80    | HTTP       | Public website              |
| 443   | HTTPS      | Secure website              |
| 3000  | Node.js    | Express/NestJS application  |
| 4000  | Custom API | Backend service             |
| 5432  | PostgreSQL | Database connection         |
| 3306  | MySQL      | Database connection         |
| 6379  | Redis      | Cache connection            |
| 27017 | MongoDB    | Database connection         |

Important: Don't open all these ports just because your application uses them. Open only the ports required for communication.

## 3. Production architecture: Separate Security Groups

For a production-style architecture, don't put every rule into one Security Group.

For example:

Security Group 1: `alb-sg`

| Direction | Port | Source      |
| --------- | ---- | ----------- |
| Inbound   | 80   | `0.0.0.0/0` |
| Inbound   | 443  | `0.0.0.0/0` |
| Outbound  | 3000 | `ec2-sg`    |

Security Group 2: `ec2-sg`

| Direction | Port                  | Source    |
| --------- | --------------------- | --------- |
| Inbound   | 3000                  | `alb-sg`  |
| Outbound  | Required destinations | As needed |

Security Group 3: `database-sg`

| Direction | Port | Source   |
| --------- | ---- | -------- |
| Inbound   | 5432 | `ec2-sg` |

This gives you the following communication:

Internet

HTTP / HTTPS

Application Load Balancer

alb-sg

Ports 80, 443

EC2 – Node.js Application

ec2-sg

Port 3000 – ALB only

RDS – PostgreSQL

database-sg

Port 5432 – EC2 only

## 4. Important security rules to remember

1. Never expose SSH (22) to everyone. Avoid `0.0.0.0/0`; use your IP `/32`, a VPN, or AWS Systems Manager Session Manager.
2. Never expose database ports publicly. Allow database access only from application Security Groups.
3. Use Security Group references. For example, allow PostgreSQL traffic from `ec2-sg` instead of allowing an entire subnet.
4. Security Groups are stateful. If inbound traffic is allowed, response traffic is automatically allowed. You don't need a separate outbound rule for the response.
5. Security Groups support allow rules, not explicit deny rules. All rules are evaluated together.
6. Security Groups are attached to network interfaces (ENIs), not directly to applications.
