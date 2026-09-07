**Constructor Property Promotion** is a feature introduced in **PHP 8.0** that lets you declare and initialize class properties directly in the constructor, reducing boilerplate code.

### Without Constructor Property Promotion

```php
class User
{
    private string $name;
    private int $age;

    public function __construct(string $name, int $age)
    {
        $this->name = $name;
        $this->age = $age;
    }
}
```

### With Constructor Property Promotion

```php
class User
{
    public function __construct(
        private string $name,
        private int $age
    ) {
    }
}
```

PHP automatically:

* Declares the properties.
* Assigns constructor arguments to those properties.

---

## Visibility Options

You can use any property visibility:

```php
class Product
{
    public function __construct(
        public string $name,
        protected float $price,
        private int $stock
    ) {
    }
}
```

---

## Default Values

Constructor parameters can have default values.

```php
class User
{
    public function __construct(
        public string $name,
        public string $role = "user"
    ) {
    }
}

$user = new User("John");
echo $user->role; // user
```

---

## Mixing Promoted and Regular Properties

```php
class Employee
{
    private string $company = "OpenAI";

    public function __construct(
        public string $name,
        private int $age
    ) {
    }
}
```

---

## Adding Validation

You can still include constructor logic.

```php
class User
{
    public function __construct(
        public string $name,
        public int $age
    ) {
        if ($this->age < 0) {
            throw new InvalidArgumentException("Age cannot be negative.");
        }
    }
}
```

---

## Readonly Promotion (PHP 8.1+)

You can combine property promotion with `readonly`.

```php
class User
{
    public function __construct(
        public readonly int $id,
        public readonly string $name
    ) {
    }
}
```

After construction, these properties cannot be changed.

---

## Reflection Example

Promoted properties behave like normal class properties.

```php
class User
{
    public function __construct(
        public string $name
    ) {
    }
}

$user = new User("Alice");

echo $user->name; // Alice
```

---

## Rules

* Available from **PHP 8.0**.
* Only works in a class constructor (`__construct`).
* Requires a visibility modifier (`public`, `protected`, or `private`).
* Supports type declarations.
* Supports nullable types.

```php
public function __construct(
    private ?string $email = null
) {}
```

---

## Benefits

* Less boilerplate code.
* Cleaner and more readable classes.
* Keeps property declaration and initialization together.
* Especially useful for Data Transfer Objects (DTOs), value objects, and service classes.

For example, a DTO becomes very concise:

```php
class CreateUserRequest
{
    public function __construct(
        public string $name,
        public string $email,
        public int $age
    ) {
    }
}
```

Instead of separately declaring properties and assigning them in the constructor, everything is defined in one place.
