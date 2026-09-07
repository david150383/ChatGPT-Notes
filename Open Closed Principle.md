The **Open/Closed Principle (OCP)** is one of the five **SOLID** principles of object-oriented design.

It states:

> **Software entities should be open for extension but closed for modification.**

Meaning:

- You should be able to **add new behavior**
- without changing existing, tested code

---

# Simple Idea

Instead of editing old code every time requirements change:

❌ Bad:

```python id="s08z2u"
if type == "credit":
    process_credit()

elif type == "paypal":
    process_paypal()

elif type == "crypto":
    process_crypto()
```

Every new payment method requires modifying existing code.

---

Better approach:

✅ Extend behavior using abstraction/polymorphism.

---

# Real-World Analogy

Think of a phone charger socket.

You can plug in:

- Android charger
- iPhone charger
- laptop charger

The socket itself doesn't change.

It is:

- **closed for modification**
- **open for extension**

---

# Example Without OCP (Bad Design)

```python id="t8kl6h"
class NotificationService:

    def send(self, type, message):

        if type == "email":
            print("Sending email:", message)

        elif type == "sms":
            print("Sending SMS:", message)
```

Problem:

- Every new notification type modifies existing code.
- Risk of breaking old functionality.

---

# Example With OCP (Good Design)

## Step 1: Create abstraction

```python id="n5hy08"
from abc import ABC, abstractmethod

class Notification(ABC):

    @abstractmethod
    def send(self, message):
        pass
```

---

## Step 2: Extend behavior

```python id="6zmb8j"
class EmailNotification(Notification):

    def send(self, message):
        print("Sending email:", message)


class SMSNotification(Notification):

    def send(self, message):
        print("Sending SMS:", message)
```

---

## Step 3: Use abstraction

```python id="w70n5u"
class NotificationService:

    def notify(self, notification: Notification, message):
        notification.send(message)
```

---

## Usage

```python id="v4s9gj"
service = NotificationService()

service.notify(EmailNotification(), "Hello")
service.notify(SMSNotification(), "Hi")
```

---

# Adding New Feature

Want WhatsApp notification?

✅ Just extend:

```python id="we2g3d"
class WhatsAppNotification(Notification):

    def send(self, message):
        print("Sending WhatsApp:", message)
```

No old code changed.

That is OCP.

---

# Key Benefits

## 1. Reduces Bugs

Old tested code remains untouched.

---

## 2. Improves Maintainability

New features are added safely.

---

## 3. Encourages Abstraction

Interfaces

- abstract classes
- polymorphism

become useful.

---

## 4. Easier Scaling

Large systems evolve cleanly.

---

# Common Ways to Achieve OCP

## Using:

- Interfaces
- Abstract classes
- Inheritance
- Polymorphism
- Strategy Pattern
- Dependency Injection

---

# OCP in Microservices

Instead of modifying one huge service:

You extend behavior by:

- adding new services
- new event consumers
- plugins
- adapters

Example:

- add new payment provider
- without changing checkout logic

---

# Bad vs Good Summary

| Bad Design                 | Good Design        |
| -------------------------- | ------------------ |
| Many if-else blocks        | Polymorphism       |
| Modify old code repeatedly | Extend new classes |
| Tight coupling             | Loose coupling     |
| Fragile system             | Flexible system    |

---

# Important Clarification

OCP does NOT mean:

- “Never modify code”

It means:

- core stable code should not require frequent modification for new features

---

# Interview-Friendly Definition

> Open/Closed Principle states that software entities should be open for extension but closed for modification, meaning new functionality should be added with minimal changes to existing code.

---

# One-Line Memory Trick

> “Add new code, don’t break old code.”
