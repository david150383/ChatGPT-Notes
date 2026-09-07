A WhatsApp-like application is a classic system design interview example because it covers scalability, real-time messaging, storage, notifications, and distributed systems.

The difference between **HLD (High-Level Design)** and **LLD (Low-Level Design)** is:

* **HLD** → Focuses on architecture, components, scalability, databases, APIs, and communication between services.
* **LLD** → Focuses on classes, objects, methods, database schema, design patterns, and implementation details.

---

# 1. HLD (High-Level Design) – WhatsApp

## Functional Requirements

* User Registration/Login
* One-to-one Chat
* Group Chat
* Online/Offline Status
* Message Delivery
* Read Receipts
* Typing Indicator
* Push Notifications
* Media Sharing
* Message History

---

## Non-Functional Requirements

* Low latency (<100ms)
* High availability
* Horizontal scalability
* Fault tolerance
* Encryption
* High throughput
* Eventually consistent

---

# HLD Architecture

```text
                  +----------------+
                  | Mobile Clients |
                  +-------+--------+
                          |
                    HTTPS / WebSocket
                          |
                  +-------v--------+
                  | Load Balancer  |
                  +-------+--------+
                          |
          +---------------+----------------+
          |               |                |
 +--------v-----+ +-------v------+ +-------v------+
 | Auth Service | | Chat Service | | Group Service|
 +--------------+ +--------------+ +--------------+
          |               |                |
          +-------+-------+----------------+
                  |
          +-------v-------+
          | Message Queue |
          | Kafka/RabbitMQ|
          +-------+-------+
                  |
      +-----------+------------+
      |                        |
+-----v------+          +------v------+
| Notification|          | Media Server|
|   Service   |          | (S3/CDN)    |
+------------+          +-------------+

                  |
         +--------v---------+
         | Database Cluster |
         +------------------+
```

---

# Components

## 1. API Gateway

Responsibilities

* Authentication
* Rate limiting
* Routing
* SSL termination

---

## 2. Authentication Service

Stores

* User profile
* Password
* JWT Token

Database

```
Users
------
userId
name
phone
passwordHash
lastSeen
```

---

## 3. Chat Service

Responsibilities

* Send Message
* Receive Message
* Maintain WebSocket connection
* Read receipts
* Typing indicator

---

## 4. Group Service

Handles

* Create Group
* Add Member
* Remove Member
* Broadcast messages

---

## 5. Notification Service

If receiver offline

↓

Push Notification

```
Firebase
Apple Push Notification
```

---

## 6. Media Service

Stores

* Images
* Videos
* Audio
* Documents

Storage

```
S3

CDN

URL stored in DB
```

---

# Database Choice

| Data         | Database           |
| ------------ | ------------------ |
| User Profile | MySQL/PostgreSQL   |
| Messages     | Cassandra/DynamoDB |
| Cache        | Redis              |
| Media        | S3                 |
| Search       | Elasticsearch      |

---

# Message Flow

```text
Sender

↓

Chat Service

↓

Kafka

↓

Receiver Online?

YES ---------------------> Deliver

NO

↓

Store in DB

↓

Push Notification

↓

Receiver Opens App

↓

Sync Pending Messages
```

---

# Scaling

```
Multiple Chat Servers

↓

Load Balancer

↓

Sticky Session

↓

WebSocket Connection
```

---

# HLD APIs

```
POST /login

POST /register

POST /sendMessage

GET /messages/{chatId}

POST /createGroup

POST /uploadMedia

POST /typing

POST /readReceipt
```

---

# 2. LLD (Low-Level Design)

Now we design classes and objects.

---

## Class Diagram

```text
           +----------------+
           |     User       |
           +----------------+
           | id             |
           | name           |
           | phone          |
           | status         |
           +----------------+
           | login()        |
           | logout()       |
           +----------------+

                    |
                    |

           +----------------+
           |     Chat       |
           +----------------+
           | chatId         |
           | participants   |
           +----------------+
           | sendMessage()  |
           | getHistory()   |
           +----------------+

                    |

         +----------+-----------+

         |                      |

+------------------+     +-------------------+
| PersonalChat     |     | GroupChat         |
+------------------+     +-------------------+
| receiver         |     | members           |
+------------------+     +-------------------+
```

---

# Message Class

```java
class Message {

    String messageId;
    String senderId;
    String receiverId;
    String content;
    MessageType type;
    MessageStatus status;
    LocalDateTime timestamp;

}
```

---

# User Class

```java
class User {

    String id;
    String name;
    String phone;

    void sendMessage(Message msg){}

    void receiveMessage(Message msg){}

}
```

---

# Chat Service

```java
class ChatService {

    MessageRepository repository;

    NotificationService notificationService;

    void sendMessage(Message message){

        repository.save(message);

        notificationService.notify(message);

    }

}
```

---

# Repository Pattern

```java
interface MessageRepository{

    void save(Message message);

    List<Message> getMessages(String chatId);

}
```

---

# Notification Service

```java
class NotificationService{

    void notify(Message message){

    }

}
```

---

# Factory Pattern

```java
interface MessageFactory{

    Message create();

}

class TextMessageFactory
implements MessageFactory{

}

class ImageMessageFactory
implements MessageFactory{

}
```

Useful when handling multiple message types:

* Text
* Image
* Video
* Audio
* File
* Location

---

# Observer Pattern

```text
User

↓

Chat Room

↓

Observers

↓

Online Users
```

When a message arrives:

```
Chat

↓

Notify Users

↓

Users Receive Message
```

---

# Strategy Pattern

```text
Encryption Strategy

AES

RSA

End-to-End Encryption
```

```java
interface EncryptionStrategy{

    encrypt();

    decrypt();

}
```

---

# State Pattern

Message State

```text
Created

↓

Sent

↓

Delivered

↓

Read
```

```java
enum MessageStatus{

CREATED,

SENT,

DELIVERED,

READ

}
```

---

# Database Tables

### User

```sql
User

id

name

phone

last_seen
```

### Chat

```sql
Chat

chat_id

type
```

### Chat Members

```sql
ChatMember

chat_id

user_id
```

### Message

```sql
Message

message_id

chat_id

sender_id

content

message_type

status

created_at
```

---

# Sequence Diagram (Send Message)

```text
User A

↓

ChatController

↓

ChatService

↓

MessageRepository

↓

Database

↓

NotificationService

↓

User B
```

---

# Interview Summary

| Aspect          | HLD                         | LLD                                          |
| --------------- | --------------------------- | -------------------------------------------- |
| Focus           | System architecture         | Code structure                               |
| Components      | Services, databases, queues | Classes, interfaces, methods                 |
| Scalability     | Yes                         | No                                           |
| APIs            | Yes                         | Sometimes                                    |
| Design Patterns | Rare                        | Common                                       |
| UML             | Architecture diagrams       | Class & sequence diagrams                    |
| Example         | Chat Service, Kafka, Redis  | `Message`, `User`, `ChatService`, Repository |

For interviews, you would typically start with the HLD (requirements, architecture, APIs, storage, scalability, message flow) and then zoom into the LLD for one feature, such as **sending a message**, where you design the classes, repositories, state transitions, and patterns used to implement that functionality.
