**Union types** in PHP let you declare that a variable, parameter, property, or return value can be one of multiple types. They were introduced in **PHP 8.0**.

### Syntax

Use the pipe (`|`) to separate allowed types.

```php
function printValue(int|string $value): void
{
    echo $value;
}
```

This function accepts either an `int` or a `string`.

### Return Types

```php
function getUserName(int $id): string|null
{
    if ($id === 1) {
        return "Alice";
    }

    return null;
}
```

You can also write this using the nullable shorthand when there's only one type plus `null`:

```php
function getUserName(int $id): ?string
{
    return $id === 1 ? "Alice" : null;
}
```

### Property Types

```php
class Product
{
    public int|float $price;
}
```

The `$price` property can hold either an integer or a floating-point number.

### Multiple Types

```php
function process(bool|int|float|string $value): void
{
    var_dump($value);
}
```

### Using Objects

```php
class Dog {}
class Cat {}

function adopt(Dog|Cat $pet): void
{
    echo "Pet adopted!";
}
```

### Special Types

Some commonly used union combinations:

```php
function findUser(int $id): User|false
{
    // Return User if found, otherwise false
}
```

```php
function getData(): array|string
{
    // May return an array or a JSON string
}
```

### Invalid Examples

Duplicate types are not allowed:

```php
// ❌ Invalid
function test(int|int $value) {}
```

Mixing `?Type` with additional union types is invalid:

```php
// ❌ Invalid
function test(?string|int $value) {}
```

Instead, write:

```php
// ✅ Correct
function test(string|int|null $value) {}
```

### Benefits

* Improves type safety.
* Makes function signatures more expressive.
* Reduces the need for PHPDoc annotations for simple cases.
* Helps IDEs provide better autocompletion and static analysis.

### Example

```php
<?php

function calculate(int|float $a, int|float $b): int|float
{
    return $a + $b;
}

echo calculate(10, 20);      // 30
echo calculate(10.5, 5);     // 15.5
```

This function accepts either integers or floats and returns either an `int` or a `float`, depending on the result.
