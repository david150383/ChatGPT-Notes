**PSR (PHP Standards Recommendations)** are a set of coding standards created by the **PHP-FIG (PHP Framework Interop Group)** to improve interoperability, consistency, and code quality across PHP projects. ([PHP-FIG][1])

### Commonly used PSR standards in PHP

| PSR        | Name                         | Purpose                                                                              |                |
| ---------- | ---------------------------- | ------------------------------------------------------------------------------------ | -------------- |
| **PSR-1**  | Basic Coding Standard        | Basic PHP coding rules (class names, methods, constants, file format) ([PHP-FIG][2]) |                |
| **PSR-4**  | Autoloading Standard         | Defines how PHP classes should map to file paths for autoloading ([PHP-FIG][3])      |                |
| **PSR-12** | Extended Coding Style        | Modern PHP code formatting standard (replacement for PSR-2) ([PHP-FIG][4])           |                |
| **PSR-3**  | Logger Interface             | Standard logging interface                                                           |                |
| **PSR-6**  | Caching Interface            | Standard cache interfaces                                                            |                |
| **PSR-7**  | HTTP Message Interface       | Standard HTTP request/response objects                                               |                |
| **PSR-11** | Container Interface          | Dependency injection container standard                                              |                |
| **PSR-14** | Event Dispatcher             | Standard event handling                                                              |                |
| **PSR-15** | HTTP Server Request Handlers | Middleware and request handling                                                      |                |
| **PSR-18** | HTTP Client                  | Standard HTTP client interface                                                       |                |
| **PSR-20** | Clock Interface              | Standard time abstraction                                                            | ([PHP-FIG][1]) |

## Important PSR examples

### 1. PSR-1 Naming rules

```php
<?php

namespace App\Models;

class UserProfile
{
    const VERSION = '1.0';

    public function getName()
    {
        return "John";
    }
}
```

Rules:

* Class names → `StudlyCaps` (`UserProfile`)
* Methods → `camelCase` (`getName()`)
* Constants → uppercase with underscores (`MAX_SIZE`)
  ([PHP-FIG][2])

---

### 2. PSR-4 Autoloading

Folder structure:

```
project/
│
├── src/
│   └── User.php
│
└── composer.json
```

`composer.json`

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

Class:

```php
<?php

namespace App;

class User
{
    public function hello()
    {
        return "Hello";
    }
}
```

Composer loads it automatically:

```bash
composer dump-autoload
```

---

### 3. PSR-12 Formatting

Example:

```php
<?php

namespace App\Service;

class UserService
{
    public function createUser(string $name): string
    {
        return $name;
    }
}
```

Common PSR-12 rules:

* 4 spaces indentation
* Opening braces on the same line
* Proper namespace and `use` formatting
* Consistent spacing and line breaks
  ([PHP-FIG][4])

---

### Why use PSR standards?

✅ Easier team collaboration
✅ Framework/library compatibility
✅ Cleaner code structure
✅ Better Composer autoloading
✅ Easier maintenance

Most modern PHP frameworks such as Laravel and Symfony follow many PSR conventions. ([PHP-FIG][3])

A practical modern PHP project usually follows:

**PSR-4 + PSR-12 + PSR-1** as the foundation. ([PHP-FIG][2])

[1]: https://www.php-fig.org/psr/?utm_source=chatgpt.com "PHP Standards Recommendations - PHP-FIG"
[2]: https://www.php-fig.org/psr/psr-1/?utm_source=chatgpt.com "PSR-1: Basic Coding Standard - PHP-FIG"
[3]: https://www.php-fig.org/?utm_source=chatgpt.com "PHP-FIG — PHP Framework Interop Group - PHP-FIG"
[4]: https://www.php-fig.org/psr/psr-12/?utm_source=chatgpt.com "PSR-12: Extended Coding Style - PHP-FIG"
