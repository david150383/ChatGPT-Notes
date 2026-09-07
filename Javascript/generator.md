A **generator** in JavaScript is a special type of function that can **pause its execution** and **resume later**. It is useful when you want to generate values one at a time instead of all at once.

### How to define a generator

A generator function is declared using `function*`:

```javascript
function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}
```

Notice the `*` after `function`.

### How it works

Calling a generator function **does not execute it immediately**. Instead, it returns a **generator object**.

```javascript
const gen = numbers();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

* `yield` pauses the function and returns a value.
* `next()` resumes execution from where it stopped.
* `done: true` means the generator has finished.

### Visual execution

```text
function* numbers() {
    yield 1;  ← pause
    yield 2;  ← pause
    yield 3;  ← pause
}
```

Each call to `next()` continues from the previous `yield`.

### Example: Infinite sequence

Generators are great for creating infinite sequences without consuming lots of memory.

```javascript
function* counter() {
  let i = 1;

  while (true) {
    yield i++;
  }
}

const c = counter();

console.log(c.next().value); // 1
console.log(c.next().value); // 2
console.log(c.next().value); // 3
```

The generator only produces values when requested.

### Using `for...of`

Generators are iterable, so you can loop over them.

```javascript
function* fruits() {
  yield "Apple";
  yield "Banana";
  yield "Orange";
}

for (const fruit of fruits()) {
  console.log(fruit);
}
```

Output:

```text
Apple
Banana
Orange
```

### Passing values back into a generator

You can send values into a generator using `next(value)`.

```javascript
function* greet() {
  const name = yield "What is your name?";
  yield `Hello, ${name}!`;
}

const gen = greet();

console.log(gen.next().value);        // "What is your name?"
console.log(gen.next("Alice").value); // "Hello, Alice!"
```

### Why use generators?

Generators are useful for:

* ✅ Lazy loading data
* ✅ Processing large datasets without loading everything into memory
* ✅ Creating custom iterators
* ✅ Infinite sequences
* ✅ Managing asynchronous workflows (before `async/await` became common)

### Generator vs Normal Function

| Normal Function              | Generator Function                     |
| ---------------------------- | -------------------------------------- |
| Runs from start to finish    | Can pause and resume                   |
| Returns once                 | Can `yield` multiple values            |
| Uses `return`                | Uses `yield` (and optionally `return`) |
| Cannot maintain paused state | Remembers its execution state          |

### Summary

Think of a generator as a **movie with a pause button**:

* `yield` = **pause** and return a value.
* `next()` = **play** from where it paused.
* The generator remembers all its local variables and execution state between pauses.

This ability to pause and resume makes generators very efficient for producing values on demand.
