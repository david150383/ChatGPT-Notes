The **null safe operator** in PHP is `?->`. It was introduced in **PHP 8.0** and allows you to safely access properties or call methods on an object that might be `null` without causing a fatal error.

### Syntax

```php
$object?->property;
$object?->method();
```

If `$object` is `null`, the expression returns `null` instead of throwing an error.

### Without the null safe operator

```php
$user = null;

echo $user->name;
// Fatal error: Attempt to read property "name" on null
```

### With the null safe operator

```php
$user = null;

echo $user?->name;
// Output: nothing (null)
```

### Calling methods

```php
class User {
    public function getName() {
        return "John";
    }
}

$user = new User();

echo $user?->getName();
// Output: John
```

If `$user` is `null`:

```php
$user = null;

echo $user?->getName();
// Output: null
```

### Chaining

The operator works well for nested objects.

```php
$name = $order?->getCustomer()?->getAddress()?->getCity();

echo $name;
```

This is equivalent to writing multiple null checks:

```php
$name = null;

if ($order !== null) {
    $customer = $order->getCustomer();

    if ($customer !== null) {
        $address = $customer->getAddress();

        if ($address !== null) {
            $name = $address->getCity();
        }
    }
}
```

### Using with the null coalescing operator

Provide a default value if the result is `null`:

```php
$city = $order?->getCustomer()?->getAddress()?->getCity() ?? 'Unknown';

echo $city;
```

### Important limitations

* It **only reads** properties or calls methods. You cannot use it to assign values.

❌ Invalid:

```php
$user?->name = "Alice";
```

* It only works with objects, not arrays.

❌ Invalid:

```php
$data = null;

$value = $data?['name'];
```

For arrays, use the null coalescing operator instead:

```php
$value = $data['name'] ?? null;
```

### Practical example

```php
class Address {
    public function city() {
        return "Hyderabad";
    }
}

class Customer {
    public ?Address $address = null;
}

class Order {
    public ?Customer $customer = null;
}

$order = new Order();

echo $order?->customer?->address?->city() ?? "City not available";
// Output: City not available
```

### Summary

| Expression                     | Result if object is `null` |
| ------------------------------ | -------------------------- |
| `$obj->method()`               | Fatal error                |
| `$obj?->method()`              | `null`                     |
| `$obj?->property`              | `null`                     |
| `$obj?->method() ?? 'Default'` | `'Default'`                |

The null safe operator is especially useful in modern PHP applications (such as Laravel and Symfony) because it makes code cleaner and avoids repetitive `if ($obj !== null)` checks.
