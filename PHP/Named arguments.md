**Named arguments** in PHP let you pass arguments to a function by specifying the parameter names instead of relying on their position. This feature was introduced in **PHP 8.0**.

### Basic syntax

```php
function greet(string $name, string $message) {
    echo "$message, $name!";
}

greet(name: "Alice", message: "Hello");
// Output: Hello, Alice!
```

### Benefits

* Improves readability.
* Lets you pass arguments in any order.
* Makes functions with many optional parameters easier to use.

### Passing arguments in a different order

```php
function createUser(string $name, int $age, string $city) {
    echo "$name is $age years old and lives in $city.";
}

createUser(
    city: "London",
    name: "John",
    age: 30
);
```

Output:

```
John is 30 years old and lives in London.
```

### Skipping optional parameters

```php
function connect(
    string $host = "localhost",
    int $port = 3306,
    string $database = "test"
) {
    echo "$host:$port/$database";
}

connect(database: "mydb");
```

Output:

```
localhost:3306/mydb
```

### Mixing positional and named arguments

You can use positional arguments first, followed by named arguments:

```php
function add($a, $b, $c) {
    return $a + $b + $c;
}

echo add(1, c: 3, b: 2); // 6
```

**Invalid:**

```php
add(a: 1, 2, 3); // Fatal error
```

Once you use a named argument, all following arguments must also be named.

### Using named arguments with built-in functions

```php
echo str_replace(
    search: "world",
    replace: "PHP",
    subject: "Hello world"
);
```

Output:

```
Hello PHP
```

### Important notes

* Parameter names become part of your function's public API. Renaming a parameter can break code that uses named arguments.
* Named arguments work with both user-defined and most built-in PHP functions.
* Unknown parameter names cause an error.

Example:

```php
function test($name) {}

test(username: "John");
```

Output:

```
Fatal error: Unknown named parameter $username
```

### Comparison

**Without named arguments**

```php
sendEmail("john@example.com", "Welcome", true, false);
```

It's not obvious what `true` and `false` represent.

**With named arguments**

```php
sendEmail(
    to: "john@example.com",
    subject: "Welcome",
    isHtml: true,
    highPriority: false
);
```

This version is much easier to read and maintain.
