PHP **Attributes** are a way to add structured metadata to classes, methods, properties, functions, parameters, and constants. They were introduced in **PHP 8.0** as a modern replacement for many annotation-based approaches (such as PHPDoc annotations).

## Basic Syntax

Attributes use the `#[...]` syntax.

```php
#[Attribute]
class ExampleAttribute
{
    public function __construct(public string $message)
    {
    }
}

#[ExampleAttribute("Hello")]
class MyClass
{
}
```

## Creating an Attribute

To create a custom attribute, mark the class with the built-in `Attribute` attribute.

```php
<?php

#[Attribute]
class Route
{
    public function __construct(
        public string $path,
        public string $method = 'GET'
    ) {}
}
```

## Using an Attribute

```php
#[Route('/users', 'GET')]
function getUsers()
{
    echo "Fetching users";
}
```

## Reading Attributes with Reflection

Attributes are accessed using PHP's Reflection API.

```php
$reflection = new ReflectionFunction('getUsers');

$attributes = $reflection->getAttributes();

foreach ($attributes as $attribute) {
    $instance = $attribute->newInstance();

    echo $instance->path . PHP_EOL;
    echo $instance->method . PHP_EOL;
}
```

**Output:**

```
/users
GET
```

## Attribute Targets

You can restrict where an attribute can be applied.

```php
#[Attribute(Attribute::TARGET_CLASS)]
class Entity
{
}
```

Other available targets include:

| Target                             | Description     |
| ---------------------------------- | --------------- |
| `Attribute::TARGET_CLASS`          | Classes         |
| `Attribute::TARGET_FUNCTION`       | Functions       |
| `Attribute::TARGET_METHOD`         | Methods         |
| `Attribute::TARGET_PROPERTY`       | Properties      |
| `Attribute::TARGET_PARAMETER`      | Parameters      |
| `Attribute::TARGET_CLASS_CONSTANT` | Class constants |
| `Attribute::TARGET_ALL`            | Anywhere        |

Example:

```php
#[Attribute(Attribute::TARGET_PROPERTY)]
class Required
{
}

class User
{
    #[Required]
    public string $name;
}
```

## Repeatable Attributes

Allow the same attribute multiple times.

```php
#[Attribute(Attribute::IS_REPEATABLE)]
class Role
{
    public function __construct(public string $name)
    {
    }
}

class Admin
{
    #[Role("read")]
    #[Role("write")]
    #[Role("delete")]
    public function permissions()
    {
    }
}
```

## Multiple Attributes

```php
#[Route('/users')]
#[Deprecated]
function listUsers()
{
}
```

## Common Use Cases

Attributes are commonly used for:

* Routing in web frameworks
* Validation rules
* Dependency Injection
* ORM entity mapping
* Serialization
* Event listeners
* API documentation
* Access control

Example:

```php
#[Required]
#[Length(min: 3, max: 20)]
public string $username;
```

## Built-in PHP Attributes

PHP provides several built-in attributes, including:

* `#[Attribute]` – Marks a class as an attribute.
* `#[Deprecated]` *(PHP 8.4+)* – Marks declarations as deprecated.
* `#[AllowDynamicProperties]` *(PHP 8.2, deprecated in PHP 8.4)* – Allows dynamic properties on a class.
* `#[Override]` *(PHP 8.3+)* – Ensures a method overrides a parent method.

Example:

```php
class Animal
{
    public function speak() {}
}

class Dog extends Animal
{
    #[Override]
    public function speak()
    {
        echo "Bark";
    }
}
```

## Advantages of Attributes

* Native language feature (no parsing PHPDoc comments)
* Type-safe constructor arguments
* Better IDE support and autocompletion
* Easy to inspect using Reflection
* Cleaner and more structured than annotations

## Summary

Attributes let you attach metadata directly to PHP code. They are especially useful for frameworks and libraries that need configuration embedded in code, such as routing, validation, dependency injection, and ORM mapping. Reflection allows your application or framework to read these attributes at runtime and act on them.


The `#[Override]` attribute was introduced in **PHP 8.3**. It tells PHP:

> "This method is intended to override a method from a parent class or implement an abstract/interface method. If it doesn't, throw an error."

This helps catch bugs caused by typos, renamed methods, or incorrect method signatures.

---

## Why is `#[Override]` useful?

Imagine you accidentally misspell a method name.

### Without `#[Override]`

```php
<?php

class Animal
{
    public function speak(): void
    {
        echo "Animal";
    }
}

class Dog extends Animal
{
    // Typo!
    public function speek(): void
    {
        echo "Bark";
    }
}

$dog = new Dog();
$dog->speak();
```

**Output**

```
Animal
```

The `speek()` method is just a **new method**, not an override. PHP doesn't warn you, and your bug can go unnoticed.

---

## With `#[Override]`

```php
<?php

class Animal
{
    public function speak(): void
    {
        echo "Animal";
    }
}

class Dog extends Animal
{
    #[Override]
    public function speek(): void
    {
        echo "Bark";
    }
}
```

PHP throws a fatal error similar to:

```
Fatal error:
Dog::speek() has #[Override] attribute,
but no matching parent method exists.
```

This immediately tells you the method name is wrong.

---

# Correct Example

```php
<?php

class Animal
{
    public function speak(): void
    {
        echo "Animal";
    }
}

class Dog extends Animal
{
    #[Override]
    public function speak(): void
    {
        echo "Bark";
    }
}

$dog = new Dog();
$dog->speak();
```

Output

```
Bark
```

---

# Example with Abstract Class

```php
<?php

abstract class Shape
{
    abstract public function area(): float;
}

class Circle extends Shape
{
    public function __construct(
        private float $radius
    ) {}

    #[Override]
    public function area(): float
    {
        return pi() * $this->radius ** 2;
    }
}

$circle = new Circle(5);

echo $circle->area();
```

Output

```
78.53981633974483
```

---

# Example with an Interface

```php
<?php

interface Logger
{
    public function log(string $message): void;
}

class FileLogger implements Logger
{
    #[Override]
    public function log(string $message): void
    {
        echo "Logging: $message";
    }
}
```

`#[Override]` also works when implementing interface methods.

---

# Renaming Protection

Suppose your parent class changes.

### Original

```php
class Vehicle
{
    public function start()
    {
    }
}

class Car extends Vehicle
{
    #[Override]
    public function start()
    {
        echo "Car started";
    }
}
```

Later someone changes the parent:

```php
class Vehicle
{
    public function begin()
    {
    }
}
```

Now `Car` still has:

```php
#[Override]
public function start()
{
}
```

PHP reports an error because `Vehicle::start()` no longer exists. Without `#[Override]`, `Car::start()` would silently become an unrelated method.

---

# Signature Checking

`#[Override]` only verifies that the method actually overrides an inherited method. PHP already enforces compatible method signatures.

For example:

```php
class ParentClass
{
    public function test(int $id): void
    {
    }
}

class ChildClass extends ParentClass
{
    #[Override]
    public function test(string $id): void
    {
    }
}
```

This fails because the parameter type is incompatible:

```
Fatal error:
Declaration of ChildClass::test(string $id)
must be compatible with ParentClass::test(int $id)
```

The signature error would occur even without `#[Override]`; the attribute adds the guarantee that an override is actually intended.

---

# Multiple Levels of Inheritance

```php
class A
{
    public function hello()
    {
        echo "A";
    }
}

class B extends A
{
    #[Override]
    public function hello()
    {
        echo "B";
    }
}

class C extends B
{
    #[Override]
    public function hello()
    {
        echo "C";
    }
}
```

Each `hello()` correctly overrides the inherited version.

---

# What `#[Override]` Does and Doesn't Do

| Feature                                      | `#[Override]`                      |
| -------------------------------------------- | ---------------------------------- |
| Checks that a parent/interface method exists | ✅ Yes                              |
| Detects method name typos                    | ✅ Yes                              |
| Prevents accidental new methods              | ✅ Yes                              |
| Checks method signature compatibility        | Indirectly (PHP already does this) |
| Changes runtime behavior                     | ❌ No                               |
| Improves performance                         | ❌ No                               |

---

## When should you use it?

It's a good practice to add `#[Override]` to **every method you intentionally override** in PHP 8.3 and later. It provides an extra layer of compile-time safety by making your intent explicit and helping catch mistakes early, especially during refactoring.
