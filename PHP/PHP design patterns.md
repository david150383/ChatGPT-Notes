PHP design patterns are reusable solutions to common software design problems. They help you write code that is **maintainable, reusable, testable, and scalable**.

## Categories of Design Patterns

### 1. Creational Patterns

These deal with object creation.

| Pattern          | Purpose                                                | Example                     |
| ---------------- | ------------------------------------------------------ | --------------------------- |
| Singleton        | Ensure only one instance exists                        | Database connection, Logger |
| Factory Method   | Create objects without specifying their concrete class | Payment gateways            |
| Abstract Factory | Create families of related objects                     | UI components               |
| Builder          | Construct complex objects step by step                 | SQL query builder           |
| Prototype        | Clone existing objects                                 | Copying configurations      |

### Example: Singleton

```php
class Database
{
    private static ?Database $instance = null;

    private function __construct() {}

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }

        return self::$instance;
    }
}

$db = Database::getInstance();
```

---

### Example: Factory Method

```php
interface PaymentGateway
{
    public function pay(float $amount);
}

class StripePayment implements PaymentGateway
{
    public function pay(float $amount)
    {
        echo "Paid using Stripe";
    }
}

class PaypalPayment implements PaymentGateway
{
    public function pay(float $amount)
    {
        echo "Paid using PayPal";
    }
}

class PaymentFactory
{
    public static function create(string $type): PaymentGateway
    {
        return match ($type) {
            'stripe' => new StripePayment(),
            'paypal' => new PaypalPayment(),
            default => throw new Exception("Unknown payment type")
        };
    }
}

$payment = PaymentFactory::create('stripe');
$payment->pay(100);
```

---

## 2. Structural Patterns

These define how classes and objects are composed.

| Pattern   | Purpose                                  |
| --------- | ---------------------------------------- |
| Adapter   | Convert one interface into another       |
| Bridge    | Separate abstraction from implementation |
| Composite | Tree-like object structures              |
| Decorator | Add behavior dynamically                 |
| Facade    | Simplify a complex subsystem             |
| Flyweight | Reduce memory usage                      |
| Proxy     | Control access to another object         |

### Example: Decorator

```php
interface Coffee
{
    public function cost(): float;
}

class BasicCoffee implements Coffee
{
    public function cost(): float
    {
        return 5;
    }
}

class MilkDecorator implements Coffee
{
    public function __construct(private Coffee $coffee) {}

    public function cost(): float
    {
        return $this->coffee->cost() + 2;
    }
}

$coffee = new MilkDecorator(new BasicCoffee());

echo $coffee->cost(); // 7
```

---

## 3. Behavioral Patterns

These define communication between objects.

| Pattern                 | Purpose                                 |
| ----------------------- | --------------------------------------- |
| Observer                | Notify dependent objects                |
| Strategy                | Swap algorithms at runtime              |
| Command                 | Encapsulate requests                    |
| State                   | Change behavior based on state          |
| Template Method         | Define algorithm skeleton               |
| Chain of Responsibility | Pass requests through handlers          |
| Mediator                | Reduce object coupling                  |
| Iterator                | Traverse collections                    |
| Visitor                 | Add operations without changing classes |
| Memento                 | Save object state                       |
| Interpreter             | Interpret a language                    |

### Example: Strategy

```php
interface DiscountStrategy
{
    public function apply(float $price): float;
}

class NoDiscount implements DiscountStrategy
{
    public function apply(float $price): float
    {
        return $price;
    }
}

class TenPercentDiscount implements DiscountStrategy
{
    public function apply(float $price): float
    {
        return $price * 0.9;
    }
}

class Cart
{
    public function __construct(private DiscountStrategy $strategy) {}

    public function total(float $amount): float
    {
        return $this->strategy->apply($amount);
    }
}

$cart = new Cart(new TenPercentDiscount());

echo $cart->total(100); // 90
```

---

## Common Design Patterns Used in Laravel

| Pattern              | Laravel Example                                                |
| -------------------- | -------------------------------------------------------------- |
| Singleton            | Service Container (`singleton()`)                              |
| Factory              | Model Factories                                                |
| Strategy             | Authentication Guards, Cache Drivers                           |
| Observer             | Model Observers                                                |
| Facade               | `Cache`, `DB`, `Auth`                                          |
| Repository           | Data access abstraction (commonly implemented in applications) |
| Dependency Injection | Constructor Injection                                          |
| Builder              | Eloquent Query Builder                                         |
| Adapter              | Filesystem drivers (Local, S3, FTP)                            |
| Decorator            | Middleware pipeline                                            |

---

## Which Patterns Should You Learn First?

1. **Dependency Injection (DI)** – Foundation for modern PHP frameworks.
2. **Repository** – Organize data access logic.
3. **Factory** – Simplify object creation.
4. **Strategy** – Replace `if/else` chains with interchangeable algorithms.
5. **Observer** – Event-driven programming.
6. **Singleton** – Understand it, but use it sparingly.
7. **Facade** – Simplify complex APIs.
8. **Builder** – Create complex objects fluently.
9. **Decorator** – Extend functionality without inheritance.
10. **Command** – Encapsulate actions, useful for queues and jobs.

These patterns cover the majority of scenarios you'll encounter in modern PHP applications, especially when working with frameworks like Laravel or Symfony. If you're preparing for interviews or aiming to improve your architecture skills, mastering these will provide a strong foundation.

**MVC (Model–View–Controller) is not usually considered a design pattern in the same category as the Gang of Four (GoF) design patterns** like Singleton, Factory, Observer, or Strategy.

MVC is generally classified as an **architectural pattern** (or architectural design pattern).

### Difference:

| Type                      | Scope                                                                  | Examples                                            |
| ------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------- |
| **Design Pattern**        | Solves a specific object-oriented design problem inside an application | Singleton, Factory, Observer, Strategy, Adapter     |
| **Architectural Pattern** | Defines the overall structure and organization of an application       | MVC, MVP, MVVM, Layered Architecture, Microservices |

### MVC Structure

```
        User
         |
         v
    Controller
         |
   ----------------
   |              |
   v              v
 Model          View
(Database)    (UI)
```

### Responsibilities:

**Model**

* Handles data and business logic
* Communicates with databases
* Represents application state

Example:

```php
class User
{
    public function find($id)
    {
        // fetch user from database
    }
}
```

**View**

* Handles presentation/UI
* Displays data to users

Example:

```php
<h1><?= $user->name ?></h1>
```

**Controller**

* Receives requests
* Calls models/services
* Returns views/responses

Example:

```php
class UserController
{
    public function show($id)
    {
        $user = User::find($id);

        return view('user.profile', [
            'user' => $user
        ]);
    }
}
```

### How MVC and Design Patterns Work Together

MVC itself is an architecture, but it often **uses design patterns internally**.

For example, a Laravel application:

```
MVC Architecture
│
├── Controller
│     └── Dependency Injection (Pattern)
│
├── Model
│     └── Active Record (Pattern)
│
├── View
│     └── Template Pattern
│
├── Events
│     └── Observer Pattern
│
├── Database
│     └── Factory Pattern
│
└── Services
      └── Strategy Pattern
```

So the relationship is:

**Architecture → How the whole application is organized**
**Design patterns → How individual components are designed**

A simple analogy:

* MVC is like the **floor plan of a house**.
* Design patterns are like **construction techniques used inside the house** (doors, wiring, plumbing solutions).

So in a PHP interview, saying **"MVC is an architectural pattern, not a design pattern"** is the technically accurate answer.
