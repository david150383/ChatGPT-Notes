# ES6+ Practical Cheat Sheet

 > **Note:** “ES6” introduced `let`, `const`, arrow functions, classes, destructuring, modules, promises, etc. Some commonly used methods below were added before/after ES6 but are essential in modern JavaScript.

 ## 1\. Variables

 | Syntax | What it does | Example | Common mistake |
| --- | --- | --- | --- |
| `let` | Block-scoped, reassignable variable | `let count = 1; count++;` | Using `let` when the value never changes |
| `const` | Block-scoped, cannot be reassigned | `const name = "Sam";` | Thinking objects/arrays declared with `const` are immutable |
| `var` | Older function-scoped variable | `var x = 10;` | Prefer `let`/`const` in modern code |

```
const user = { name: "Sam" };
user.name = "Alex"; // ✅ allowed
// user = {};       // ❌ not allowed
```

 ## 2\. Arrow Functions

```
const add = (a, b) => a + b;
const square = x => x * x;
```

 **Does:** Creates shorter functions and preserves the surrounding `this`.

 **Mistakes:**

 - Forgetting `{}` means an implicit return.
- Using arrow functions when you actually need a function's own `this`.

```
const double = x => x * 2;       // implicit return
const double2 = x => { x * 2 };  // ❌ returns undefined
```

 ## 3\. Template Literals

```
const name = "Sam";
const age = 25;

const message = `Hi ${name}, you are ${age}.`;
```

 **Does:** Creates strings with interpolation and multiline support.

 **Mistake:** Using quotes instead of backticks.

---

 # Arrays

 ## 4\. `map()`

```
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
// [2, 4, 6]
```

 **Does:** Creates a new array by transforming every element.

 **Mistake:** Using `map()` when you don't need the resulting array.

---

 ## 5\. `filter()`

```
const nums = [1, 2, 3, 4];
const even = nums.filter(n => n % 2 === 0);
// [2, 4]
```

 **Does:** Returns elements that pass a condition.

 **Mistake:** Forgetting to return a condition from a block body.

```
nums.filter(n => { n > 2 }); // ❌
nums.filter(n => n > 2);     // ✅
```

---

 ## 6\. `find()`

```
const users = [{id: 1}, {id: 2}];

const user = users.find(u => u.id === 2);
// {id: 2}
```

 **Does:** Returns the **first matching element**, or `undefined`.

 **Mistake:** Expecting all matches → use `filter()`.

---

 ## 7\. `findIndex()`

```
const nums = [10, 20, 30];
nums.findIndex(n => n === 20); // 1
```

 **Does:** Returns the index of the first match, or `-1`.

---

 ## 8\. `some()`

```
[1, 2, 3].some(n => n > 2); // true
```

 **Does:** Checks whether **at least one** element matches.

---

 ## 9\. `every()`

```
[2, 4, 6].every(n => n % 2 === 0); // true
```

 **Does:** Checks whether **all** elements match.

---

 ## 10\. `reduce()`

```
const nums = [1, 2, 3, 4];

const total = nums.reduce((sum, n) => sum + n, 0);
// 10
```

 **Does:** Combines an array into a single value.

 **Mistakes:**

 - Forgetting the initial value.
- Using `reduce()` when `map()`/`filter()` is clearer.

---

 ## 11\. `includes()`

```
["js", "python"].includes("js"); // true
```

 **Does:** Checks whether an array contains a value.

 **Mistake:** For objects, `includes()` checks reference equality, not object contents.

---

 ## 12\. `sort()`

```
const nums = [10, 2, 5];
nums.sort((a, b) => a - b);
// [2, 5, 10]
```

 **Does:** Sorts an array **in place**.

 **Big mistake:**

```
[10, 2, 5].sort();
// [10, 2, 5] — lexicographic/string sorting!
```

 Use a comparator for numbers.

---

 # Objects

 ## 13\. Destructuring

```
const user = { name: "Sam", age: 25 };

const { name, age } = user;
```

 **Does:** Extracts values from objects.

```
const { name: userName } = user;
```

 **Mistake:** Confusing renaming syntax: `{ name: userName }` means `userName` receives `name`.

---

 ## 14\. Array Destructuring

```
const colors = ["red", "blue"];

const [first, second] = colors;
```

 **Does:** Extracts values by position.

```
const [first, , third] = [10, 20, 30];
```

---

 ## 15\. Spread `...`

```
const a = [1, 2];
const b = [...a, 3];
// [1, 2, 3]
```

```
const user = { name: "Sam" };
const updated = { ...user, age: 25 };
```

 **Does:** Expands iterable/object values.

 **Mistake:** Spread makes a **shallow copy**, not a deep copy.

---

 ## 16\. Rest `...`

```
const [first, ...rest] = [1, 2, 3, 4];
// first = 1
// rest = [2, 3, 4]
```

```
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
```

 **Does:** Collects remaining values.

 **Remember:** Same `...` syntax, opposite purpose:

 - **Spread:** expands
- **Rest:** collects

---

 ## 17\. Default Parameters

```
function greet(name = "Guest") {
  return `Hello ${name}`;
}
```

 **Does:** Provides a fallback when an argument is `undefined`.

 **Mistake:** `null` does **not** trigger the default.

---

 # Useful Operators

 ## 18\. Optional Chaining `?.`

```
const city = user?.address?.city;
```

 **Does:** Safely accesses nested properties without throwing when an intermediate value is `null`/`undefined`.

 **Mistake:** It doesn't make every falsy value disappear—`0`, `false`, and `""` are still valid values.

---

 ## 19\. Nullish Coalescing `??`

```
const name = user.name ?? "Guest";
```

 **Does:** Uses the fallback only when the left side is `null` or `undefined`.

```
0 ?? 10       // 0
0 || 10       // 10
```

 **Common mistake:** Using `||` when `0`, `false`, or `""` should be preserved.

---

 # Sets & Maps

 ## 20\. `Set`

```
const unique = new Set([1, 2, 2, 3]);
// Set {1, 2, 3}

unique.add(4);
unique.has(2); // true
unique.delete(2);
```

 **Does:** Stores unique values.

 **Useful for:** Removing duplicates.

```
const uniqueArray = [...new Set([1, 1, 2, 3])];
// [1, 2, 3]
```

---

 ## 21\. `Map`

```
const users = new Map();

users.set("id1", "Sam");
users.get("id1"); // "Sam"
users.has("id1"); // true
```

 **Does:** Stores key-value pairs; keys can be any value.

 **Mistake:** Don't confuse `Map` with a plain object. Use `Map` when you specifically need map semantics.

---

 # Promises & Async

 ## 22\. Promise

```
const promise = fetch("/api/users");

promise
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

 **Does:** Represents the eventual result of an asynchronous operation.

 **Common mistake:** Forgetting error handling.

---

 ## 23\. `async` / `await`

```
async function getUsers() {
  try {
    const res = await fetch("/api/users");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

 **Does:** Makes Promise-based asynchronous code easier to read.

 **Mistakes:**

 - `await` only works inside an `async` function (with modern module/top-level-await exceptions).
- Forgetting that an `async` function **always returns a Promise**.

---

 # Classes & Modules

 ## 24\. Classes

```
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hi, ${this.name}`;
  }
}

const sam = new Person("Sam");
```

 **Does:** Provides syntax for creating objects with shared behavior.

 **Mistake:** Forgetting `new` when instantiating a class.

---

 ## 25\. Import / Export

```
// math.js
export const add = (a, b) => a + b;
```

```
// app.js
import { add } from "./math.js";

console.log(add(2, 3));
```

 **Does:** Splits code into reusable modules.

 **Common mistake:** Mixing up named and default exports.

```
export default add;     // default
import add from "./math.js";

export { add };         // named
import { add } from "./math.js";
```

---

 # ⭐ Quick Memory Guide

 | Need to... | Use |
| --- | --- |
| Transform every item | `map()` |
| Keep matching items | `filter()` |
| Get first matching item | `find()` |
| Check if one matches | `some()` |
| Check if all match | `every()` |
| Combine into one value | `reduce()` |
| Check array membership | `includes()` |
| Remove duplicates | `Set` |
| Safely access nested data | `?.` |
| Provide fallback for null/undefined | `??` |
| Copy/combine arrays/objects | `...spread` |
| Collect function arguments | `...rest` |
| Extract object/array values | Destructuring |
| Handle async code | `async` / `await` |
| Create reusable modules | `import` / `export` |

 **Golden rule:** Prefer `const` by default, use `let` when reassignment is necessary, and avoid `var` in modern code.