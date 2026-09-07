With only **2 days**, don't try to learn everything. Since you already have **10 years PHP + Laravel experience and 5 years Node.js**, focus on **senior-level interview topics** that changed or are commonly asked.

Here is a crash preparation plan + important Q&A.

---

# Day 1: PHP 8 + Laravel Core + Database

## 1. PHP 8 Interview Questions

### Q1. What are the major features introduced in PHP 8?

**Answer:**

PHP 8 introduced:

* JIT (Just-In-Time) compiler
* Union types
* Attributes
* Match expression
* Constructor property promotion
* Null safe operator
* Named arguments
* Enums (PHP 8.1)
* Readonly properties (PHP 8.1)
* Fibers (PHP 8.1)

Example:

```php
class User
{
    public function __construct(
        private string $name,
        private int $age
    ) {}
}
```

---

### Q2. Difference between `==` and `===` in PHP?

**Answer:**

`==` checks value only.

```php
5 == "5"; // true
```

`===` checks value and datatype.

```php
5 === "5"; // false
```

For production code, prefer `===`.

---

### Q3. Difference between interface and abstract class?

**Interface:**

* Defines a contract
* Cannot contain implementation (except default methods in newer PHP features are limited)
* Multiple interfaces can be implemented

Example:

```php
interface Payment
{
    public function pay();
}
```

**Abstract class:**

* Can contain both abstract and normal methods
* Can have properties
* Only one parent class can be extended

---

### Q4. Explain Dependency Injection.

Instead of creating dependencies inside a class:

Bad:

```php
class Order
{
    public function send()
    {
        $mail = new Mail();
    }
}
```

Good:

```php
class Order
{
    public function __construct(
        private Mail $mail
    ){}
}
```

Benefits:

* Loose coupling
* Easier testing
* Better maintainability

---

# Laravel Interview Questions

## Q5. Explain Laravel Request Lifecycle.

Answer:

Flow:

```
Browser Request
      |
public/index.php
      |
HTTP Kernel
      |
Service Providers
      |
Middleware
      |
Router
      |
Controller
      |
Response
```

Important points:

1. Application starts from `public/index.php`
2. Laravel creates application instance
3. Loads service providers
4. Runs middleware
5. Executes controller
6. Returns response

---

## Q6. What is Laravel Service Container?

Answer:

Laravel Service Container manages class dependencies and performs dependency injection.

Example:

```php
$this->app->bind(
    PaymentInterface::class,
    StripePayment::class
);
```

When Laravel needs `PaymentInterface`, it automatically provides `StripePayment`.

Benefits:

* Dependency management
* Testing
* Loose coupling

---

## Q7. Difference between Service Provider and Service Container?

| Service Container    | Service Provider               |
| -------------------- | ------------------------------ |
| Stores dependencies  | Registers dependencies         |
| Resolves classes     | Bootstrap application services |
| Core Laravel feature | Used to configure container    |

---

## Q8. Difference between `bind()` and `singleton()`?

### bind()

Creates new instance every time.

```php
$this->app->bind(
    UserService::class
);
```

### singleton()

Creates one instance and reuses it.

```php
$this->app->singleton(
    UserService::class
);
```

---

# Eloquent Questions

## Q9. Explain Eloquent relationships.

Common relationships:

### One to One

User has one profile:

```php
return $this->hasOne(Profile::class);
```

---

### One to Many

User has many posts:

```php
return $this->hasMany(Post::class);
```

---

### Many to Many

Users have many roles:

```php
return $this->belongsToMany(Role::class);
```

---

## Q10. What is N+1 query problem?

Example:

```php
$users = User::all();

foreach($users as $user)
{
    echo $user->posts;
}
```

Queries:

```
1 query for users
+
100 queries for posts
```

Solution:

Eager loading:

```php
$users = User::with('posts')->get();
```

---

## Q11. Difference between `where()` and `having()`?

`where` filters rows before grouping.

Example:

```sql
SELECT *
FROM users
WHERE age > 20;
```

`having` filters after aggregation.

Example:

```sql
SELECT count(*)
FROM orders
GROUP BY user_id
HAVING count(*) > 5;
```

---

# Laravel API Questions

## Q12. How do you create REST API in Laravel?

Steps:

1. Create route

```php
Route::get('/users',
[UserController::class,'index']);
```

2. Controller

```php
public function index()
{
    return UserResource::collection(
        User::all()
    );
}
```

3. Resource formats response.

---

## Q13. Authentication methods in Laravel?

Common:

### Laravel Sanctum

Used for:

* SPA
* Mobile apps
* Simple token authentication

### Passport

Used for:

* OAuth2
* Enterprise applications

---

# Queue Questions

## Q14. Why use queues?

For slow tasks:

* Emails
* Reports
* Notifications
* Image processing

Example:

```
User Request
      |
Create Job
      |
Queue
      |
Worker
      |
Process
```

---

## Q15. How does Laravel Queue work?

Example:

Create job:

```
php artisan make:job SendEmail
```

Job:

```php
class SendEmail implements ShouldQueue
{
    public function handle()
    {
        Mail::send(...);
    }
}
```

Worker:

```
php artisan queue:work
```

---

# Database Optimization Questions

## Q16. How to optimize slow Laravel application?

Answer:

1. Add database indexes
2. Avoid N+1 queries
3. Use eager loading
4. Use caching
5. Optimize queries
6. Use queues
7. Use Redis
8. Use pagination

---

# System Design Questions (10 Years Experience)

## Q17. Design a scalable Laravel application.

Answer:

Architecture:

```
Load Balancer

      |
Multiple Laravel Servers

      |
Redis Cache

      |
Queue Workers

      |
Database Master
      |
Read Replicas
```

Consider:

* Caching
* Database optimization
* Horizontal scaling
* Queue processing
* Monitoring

---

## Q18. Explain Repository Pattern.

Instead of:

```
Controller
    |
Database
```

Use:

```
Controller
    |
Service
    |
Repository
    |
Database
```

Example:

```php
interface UserRepository
{
    public function find($id);
}
```

Benefits:

* Clean code
* Easy testing
* Database replacement

---

# Day 2: Advanced + Architecture + Your Node.js Advantage

Prepare these topics:

## Must know:

### Laravel

✅ Service Container
✅ Providers
✅ Middleware
✅ Events & Listeners
✅ Jobs & Queues
✅ Scheduler
✅ Notifications
✅ Policies & Gates
✅ API Resources
✅ Sanctum
✅ Redis Cache

---

### PHP

✅ OOP principles
✅ Traits
✅ Namespaces
✅ Composer
✅ PSR standards
✅ SOLID principles
✅ Design patterns

---

### Database

✅ Indexing
✅ Transactions
✅ Isolation levels
✅ Deadlocks
✅ Query optimization

---

# Questions you should answer from your experience

For a 10-year developer, interviewers will ask:

### "Tell me about your recent project."

Prepare:

* Architecture
* Database size
* Number of users
* Challenges
* Performance improvements
* Deployment process

---

### "You worked in Node.js for 5 years. Why return to PHP?"

Good answer:

> "My core background is PHP and Laravel. Working with Node.js improved my understanding of asynchronous programming, APIs, distributed systems, and event-driven architecture. Now I want to combine that experience with my Laravel expertise to build scalable backend systems."

---

### "What improvements will you bring compared to a normal Laravel developer?"

Answer:

> "Because of my Node.js experience, I have stronger exposure to API design, event-driven systems, caching strategies, asynchronous processing, and scalable backend architecture."

---

My suggestion for your 2 days:

**First 8 hours:** Laravel Service Container + Eloquent + Queues + API
**Next 8 hours:** PHP 8 + SOLID + Design Patterns + SQL
**Last day:** Practice explaining your projects and architecture.

With your experience level, the interview will likely focus less on syntax and more on **architecture, performance, and decision-making**.
