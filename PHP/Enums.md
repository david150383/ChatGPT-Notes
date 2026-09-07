PHP **Enums** (introduced in **PHP 8.1**) provide a way to define a fixed set of named values. They make code more readable, type-safe, and less error-prone than using strings or constants.

## Basic Enum

```php
<?php

enum Status
{
    case Pending;
    case Approved;
    case Rejected;
}

$status = Status::Approved;

if ($status === Status::Approved) {
    echo "Application approved.";
}
```

## Backed Enums

A backed enum has a scalar value (`string` or `int`) associated with each case.

### String-backed enum

```php
<?php

enum Role: string
{
    case Admin = 'admin';
    case User = 'user';
    case Guest = 'guest';
}

echo Role::Admin->value; // admin
```

### Integer-backed enum

```php
<?php

enum Priority: int
{
    case Low = 1;
    case Medium = 2;
    case High = 3;
}

echo Priority::High->value; // 3
```

## Creating Enum from a Value

Use `from()` when you're sure the value exists:

```php
$role = Role::from('admin');

echo $role->name;  // Admin
echo $role->value; // admin
```

Use `tryFrom()` to avoid exceptions:

```php
$role = Role::tryFrom('manager');

if ($role === null) {
    echo "Invalid role";
}
```

## Enum Methods

Enums can contain methods.

```php
enum OrderStatus
{
    case Pending;
    case Processing;
    case Delivered;

    public function label(): string
    {
        return match($this) {
            self::Pending => 'Pending',
            self::Processing => 'Processing',
            self::Delivered => 'Delivered',
        };
    }
}

echo OrderStatus::Delivered->label();
```

## Enum with Business Logic

```php
enum PaymentStatus
{
    case Pending;
    case Paid;
    case Failed;

    public function isCompleted(): bool
    {
        return $this === self::Paid;
    }
}

$status = PaymentStatus::Paid;

if ($status->isCompleted()) {
    echo "Payment completed";
}
```

## Getting All Cases

```php
foreach (Role::cases() as $role) {
    echo $role->name . " => " . $role->value . PHP_EOL;
}
```

Output:

```
Admin => admin
User => user
Guest => guest
```

## Using Enums as Function Parameters

```php
function setRole(Role $role): void
{
    echo "Role: {$role->value}";
}

setRole(Role::Admin);
```

Passing anything other than a `Role` enum instance results in a type error.

## Match with Enums

```php
$message = match ($status) {
    Status::Pending => 'Waiting',
    Status::Approved => 'Accepted',
    Status::Rejected => 'Denied',
};
```

## Enum Interfaces

Enums can implement interfaces.

```php
interface HasLabel
{
    public function label(): string;
}

enum Size implements HasLabel
{
    case Small;
    case Medium;
    case Large;

    public function label(): string
    {
        return match($this) {
            self::Small => 'S',
            self::Medium => 'M',
            self::Large => 'L',
        };
    }
}
```

## Limitations

Enums **can**:

* Define cases
* Have methods
* Implement interfaces
* Use traits (without properties)

Enums **cannot**:

* Extend another enum or class
* Be instantiated with `new`
* Have instance or static properties
* Inherit from another enum

## When to Use Enums

Use enums when a value must be one of a predefined set, such as:

* User roles (`Admin`, `User`, `Guest`)
* Order status (`Pending`, `Shipped`, `Delivered`)
* Payment status (`Pending`, `Paid`, `Failed`)
* HTTP methods (`GET`, `POST`, `PUT`, `DELETE`)
* Days of the week or months
* Priority levels (`Low`, `Medium`, `High`)

## Best Practices

* Prefer enums over string literals or magic numbers for fixed sets of values.
* Use **backed enums** when values need to be stored in a database or exchanged via APIs.
* Keep business logic related to enum values inside the enum (for example, `label()`, `isCompleted()`).
* Use `tryFrom()` when working with user input to safely handle invalid values.
* Use `match` expressions with enums for clear, exhaustive handling of all cases.
