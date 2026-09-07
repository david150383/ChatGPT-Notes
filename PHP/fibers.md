**PHP Fibers** are a low-level concurrency feature introduced in **PHP 8.1**. They allow you to pause (suspend) and resume execution at arbitrary points, making it possible to write asynchronous code in a synchronous style.

Unlike threads, Fibers **do not run in parallel**. They provide **cooperative multitasking**, meaning a Fiber runs until it explicitly yields control.

## Why use Fibers?

Fibers are useful for:

* Asynchronous programming
* Event loops
* Non-blocking I/O
* Building async frameworks (like ReactPHP and Amp)

## Basic Example

```php
<?php

$fiber = new Fiber(function (): void {
    echo "Started\n";

    Fiber::suspend("Paused");

    echo "Resumed\n";
});

echo $fiber->start(); // Started
                      // Paused

$fiber->resume();     // Resumed
```

### Output

```
Started
Paused
Resumed
```

## Fiber Lifecycle

1. **Create**

```php
$fiber = new Fiber(function () {
    echo "Hello";
});
```

2. **Start**

```php
$fiber->start();
```

3. **Suspend**

```php
Fiber::suspend($value);
```

4. **Resume**

```php
$fiber->resume();
```

5. **Terminate**

When the function finishes, the fiber is terminated.

## Passing Values

```php
$fiber = new Fiber(function () {
    $name = Fiber::suspend("Waiting...");
    echo "Hello $name\n";
});

echo $fiber->start();   // Waiting...

$fiber->resume("John");
```

Output:

```
Waiting...
Hello John
```

## Checking Fiber State

```php
$fiber->isStarted();
$fiber->isSuspended();
$fiber->isRunning();
$fiber->isTerminated();
```

## Returning a Value

```php
$fiber = new Fiber(function () {
    Fiber::suspend();
    return 100;
});

$fiber->start();
$fiber->resume();

echo $fiber->getReturn(); // 100
```

## Exception Handling

Exceptions thrown inside a Fiber propagate when the Fiber is started or resumed.

```php
$fiber = new Fiber(function () {
    throw new Exception("Something went wrong");
});

try {
    $fiber->start();
} catch (Exception $e) {
    echo $e->getMessage();
}
```

## Fibers vs Generators

| Fibers                           | Generators                |
| -------------------------------- | ------------------------- |
| Can suspend anywhere             | Suspend only at `yield`   |
| Can resume with values           | Resume only via iteration |
| Used for async frameworks        | Used for lazy iteration   |
| Full execution context preserved | Iterator-focused          |

## Fibers vs Threads

| Fibers                                  | Threads                             |
| --------------------------------------- | ----------------------------------- |
| Single OS thread                        | Multiple OS threads                 |
| Cooperative scheduling                  | Preemptive scheduling               |
| Lightweight                             | Heavier                             |
| No shared-memory synchronization needed | Requires synchronization mechanisms |

## Real-world Use Case

Imagine downloading data from multiple APIs without blocking:

```php
$fiber1 = new Fiber(function () {
    echo "Fetching API 1...\n";
    Fiber::suspend();
    echo "API 1 complete\n";
});

$fiber2 = new Fiber(function () {
    echo "Fetching API 2...\n";
    Fiber::suspend();
    echo "API 2 complete\n";
});

$fiber1->start();
$fiber2->start();

// Event loop or scheduler decides when to continue
$fiber1->resume();
$fiber2->resume();
```

In production, a scheduler or event loop (such as those provided by async frameworks) coordinates when fibers should resume after I/O becomes ready.

### Key Points

* Available from **PHP 8.1+**.
* Fibers are **not parallel execution**; they enable cooperative multitasking.
* A Fiber must explicitly call `Fiber::suspend()` to yield control.
* They are primarily intended for building asynchronous libraries and frameworks, rather than replacing normal functions in everyday PHP code.
