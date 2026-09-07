In PHP 8.0+, the **`match` expression** provides a cleaner, stricter alternative to the `switch` statement.

### Syntax

```php
$result = match ($value) {
    condition1 => result1,
    condition2 => result2,
    default => defaultResult,
};
```

### Example 1: Basic Usage

```php
<?php

$status = 200;

$message = match ($status) {
    200 => "OK",
    404 => "Not Found",
    500 => "Internal Server Error",
    default => "Unknown Status",
};

echo $message;
```

**Output:**

```
OK
```

---

### Example 2: Multiple Values

```php
<?php

$grade = 'B';

$result = match ($grade) {
    'A' => "Excellent",
    'B', 'C' => "Good",
    'D' => "Pass",
    'F' => "Fail",
    default => "Invalid Grade",
};

echo $result;
```

**Output:**

```
Good
```

---

### Example 3: Using Expressions

```php
<?php

$num = 10;

$result = match (true) {
    $num > 0 => "Positive",
    $num < 0 => "Negative",
    default => "Zero",
};

echo $result;
```

**Output:**

```
Positive
```

---

## `match` vs `switch`

| `match`                               | `switch`                               |
| ------------------------------------- | -------------------------------------- |
| Uses strict comparison (`===`)        | Uses loose comparison (`==`)           |
| Returns a value                       | Doesn't return a value directly        |
| No `break` needed                     | Requires `break` to avoid fall-through |
| No fall-through                       | Fall-through is allowed                |
| Must be exhaustive (or use `default`) | `default` is optional                  |

### Example

```php
$value = "1";

echo match ($value) {
    1 => "Integer",
    "1" => "String",
};
```

**Output:**

```
String
```

Because `match` uses **strict (`===`) comparison**, `"1"` is **not** equal to `1`.

---

## When to use `match`

Use `match` when:

* You need to return a value.
* You want strict type comparisons.
* You want cleaner, more readable code.
* You don't want to worry about missing `break` statements.

`match` is generally preferred over `switch` in modern PHP (8.0+) when mapping input values to corresponding outputs.
