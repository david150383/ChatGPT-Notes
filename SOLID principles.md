**SOLID principles** are five object-oriented design principles that help developers write code that is easier to understand, maintain, test, and extend.

### S — Single Responsibility Principle (SRP)

**Definition:** A class should have only **one reason to change**, meaning it should have only one responsibility.

❌ **Bad Example**

```java
class Report {
    void generateReport() { }
    void printReport() { }
    void saveToDatabase() { }
}
```

This class is responsible for generating, printing, and saving reports.

✅ **Good Example**

```java
class ReportGenerator {
    void generateReport() { }
}

class ReportPrinter {
    void printReport() { }
}

class ReportRepository {
    void saveToDatabase() { }
}
```

Each class has a single responsibility.

---

### O — Open/Closed Principle (OCP)

**Definition:** Software entities should be **open for extension but closed for modification**.

Instead of modifying existing code, extend it with new functionality.

❌ **Bad Example**

```java
class Discount {
    double calculate(String customerType) {
        if (customerType.equals("Regular"))
            return 10;
        else if (customerType.equals("Premium"))
            return 20;
        return 0;
    }
}
```

Adding a new customer type requires modifying the class.

✅ **Good Example**

```java
interface Discount {
    double calculate();
}

class RegularDiscount implements Discount {
    public double calculate() {
        return 10;
    }
}

class PremiumDiscount implements Discount {
    public double calculate() {
        return 20;
    }
}
```

New discount types can be added without changing existing classes.

---

### L — Liskov Substitution Principle (LSP)

**Definition:** Objects of a subclass should be replaceable with objects of the superclass **without breaking the program**.

❌ **Bad Example**

```java
class Bird {
    void fly() { }
}

class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException();
    }
}
```

A penguin cannot fly, so it violates LSP.

✅ **Good Example**

```java
class Bird { }

interface Flyable {
    void fly();
}

class Sparrow extends Bird implements Flyable {
    public void fly() { }
}

class Penguin extends Bird {
}
```

Only birds that can fly implement `Flyable`.

---

### I — Interface Segregation Principle (ISP)

**Definition:** Clients should **not be forced to depend on interfaces they do not use**.

❌ **Bad Example**

```java
interface Worker {
    void work();
    void eat();
}

class Robot implements Worker {
    public void work() { }

    public void eat() {
        throw new UnsupportedOperationException();
    }
}
```

Robots don't eat.

✅ **Good Example**

```java
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

class Human implements Workable, Eatable {
    public void work() { }
    public void eat() { }
}

class Robot implements Workable {
    public void work() { }
}
```

Each class implements only the interfaces it needs.

---

### D — Dependency Inversion Principle (DIP)

**Definition:** High-level modules should **depend on abstractions (interfaces), not concrete implementations**.

❌ **Bad Example**

```java
class Keyboard { }

class Computer {
    private Keyboard keyboard = new Keyboard();
}
```

The `Computer` class is tightly coupled to `Keyboard`.

✅ **Good Example**

```java
interface InputDevice { }

class Keyboard implements InputDevice { }

class Computer {
    private InputDevice device;

    Computer(InputDevice device) {
        this.device = device;
    }
}
```

Now `Computer` can work with any `InputDevice` (e.g., keyboard, mouse, touchscreen).

---

## Summary Table

| Principle                     | Meaning                                         | Benefit                           |
| ----------------------------- | ----------------------------------------------- | --------------------------------- |
| **S** – Single Responsibility | One class, one responsibility                   | Easier maintenance                |
| **O** – Open/Closed           | Extend without modifying existing code          | Flexible and scalable             |
| **L** – Liskov Substitution   | Subclasses should replace parent classes safely | Reliable inheritance              |
| **I** – Interface Segregation | Small, focused interfaces                       | Avoid unnecessary dependencies    |
| **D** – Dependency Inversion  | Depend on interfaces, not implementations       | Loose coupling and easier testing |

### Easy way to remember

* **S** → One job per class.
* **O** → Add new features by extending, not editing existing code.
* **L** → A child class should behave like its parent.
* **I** → Keep interfaces small and specific.
* **D** → Depend on abstractions (interfaces), not concrete classes.

These principles are widely used in Java, C#, C++, Python, and other object-oriented languages to create clean, maintainable, and scalable software.
