# TypeScript Cheatsheet

## Basic Types

```ts
let age: number = 25;
let name: string = "Alice";
let isActive: boolean = true;

let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["A", "B"];

let anything: any = "hello";
let unknownValue: unknown = 10;

let nothing: null = null;
let notDefined: undefined = undefined;
```

---

## Functions

```ts
function add(a: number, b: number): number {
  return a + b;
}

const greet = (name: string): string => {
  return `Hello ${name}`;
};
```

### Optional & Default Parameters

```ts
function log(message: string, user?: string) {}

function multiply(a: number, b: number = 2) {
  return a * b;
}
```

---

## Object Types

```ts
const user: { name: string; age: number } = {
  name: "John",
  age: 30,
};
```

---

## Type Aliases

```ts
type User = {
  id: number;
  name: string;
};

const u: User = {
  id: 1,
  name: "Alice",
};
```

---

## Interfaces

```ts
interface Person {
  name: string;
  age: number;
}

const p: Person = {
  name: "Bob",
  age: 40,
};
```

### Extending Interfaces

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
```

---

## Union & Literal Types

```ts
let id: string | number;

type Status = "success" | "error" | "loading";
```

---

## Type Assertions

```ts
const value: unknown = "hello";

const len = (value as string).length;
```

---

## Arrays & Tuples

```ts
let scores: number[] = [90, 80];

let tuple: [string, number] = ["Alice", 25];
```

---

## Enums

```ts
enum Role {
  Admin,
  User,
  Guest,
}

let role: Role = Role.Admin;
```

---

## Generics

```ts
function identity<T>(value: T): T {
  return value;
}

identity<string>("hello");
identity<number>(123);
```

### Generic Interface

```ts
interface ApiResponse<T> {
  data: T;
  success: boolean;
}
```

---

## Classes

```ts
class Person {
  constructor(
    public name: string,
    private age: number,
  ) {}

  greet() {
    console.log(`Hi ${this.name}`);
  }
}
```

---

## Access Modifiers

```ts
public;
private;
protected;
readonly;
```

---

## Async / Await

```ts
async function fetchData(): Promise<string> {
  return "data";
}

async function run() {
  const result = await fetchData();
}
```

---

## Utility Types

```ts
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
type ReadonlyUser = Readonly<User>;

type UserName = Pick<User, "name">;
type UserWithoutId = Omit<User, "id">;
```

---

## Type Narrowing

```ts
function print(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  }
}
```

---

## keyof & typeof

```ts
type UserKeys = keyof User;

const settings = {
  darkMode: true,
};

type Settings = typeof settings;
```

---

## Record Type

```ts
const roles: Record<string, number> = {
  admin: 1,
  user: 2,
};
```

---

## Optional Chaining & Nullish Coalescing

```ts
user?.profile?.name;

const value = input ?? "default";
```

---

## Modules

### Export

```ts
export const pi = 3.14;

export default function hello() {}
```

### Import

```ts
import hello, { pi } from "./math";
```

---

## Common tsconfig Settings

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "esModuleInterop": true
  }
}
```

---

## Useful CLI Commands

```bash
# install typescript
npm install -D typescript

# initialize tsconfig
npx tsc --init

# compile
npx tsc

# watch mode
npx tsc --watch
```

---

## Common Built-in Utility Types

| Utility         | Purpose                      |
| --------------- | ---------------------------- |
| `Partial<T>`    | Make all properties optional |
| `Required<T>`   | Make all properties required |
| `Readonly<T>`   | Make properties readonly     |
| `Pick<T, K>`    | Select keys                  |
| `Omit<T, K>`    | Remove keys                  |
| `Record<K, T>`  | Key-value object             |
| `Exclude<T, U>` | Remove union members         |
| `Extract<T, U>` | Keep matching union members  |

---

## Advanced Types

### Intersection Types

```ts
type A = { a: string };
type B = { b: number };

type C = A & B;
```

### Conditional Types

```ts
type IsString<T> = T extends string ? true : false;
```

### Mapped Types

```ts
type ReadonlyType<T> = {
  readonly [K in keyof T]: T[K];
};
```

---

## React + TypeScript Example

```tsx
type Props = {
  title: string;
};

function Header({ title }: Props) {
  return <h1>{title}</h1>;
}
```

---

## Quick Tips

- Prefer `type` for unions and utility composition
- Prefer `interface` for object/class contracts
- Use `unknown` instead of `any` when possible
- Enable `"strict": true`
- Avoid enums in modern apps unless necessary
- Use generics for reusable logic

# `type` vs `interface` in TypeScript

Both are used to define shapes/types of data, and in many cases they work similarly.

---

# Quick Comparison

| Feature                | `type`   | `interface`    |
| ---------------------- | -------- | -------------- |
| Object shapes          | ✅       | ✅             |
| Extend/inherit         | ✅       | ✅             |
| Union types            | ✅       | ❌             |
| Primitive aliases      | ✅       | ❌             |
| Tuples                 | ✅       | ❌             |
| Declaration merging    | ❌       | ✅             |
| Better for React props | ✅ Often | ✅ Also common |
| Better for OOP/classes | ⚡ Good  | ⭐ Best        |

---

# Basic Example

## Interface

```ts id="5cnjs7"
interface User {
  name: string;
  age: number;
}
```

## Type

```ts id="pqz4hx"
type User = {
  name: string;
  age: number;
};
```

These are mostly equivalent.

---

# Main Differences

## 1. `type` Can Create Unions

```ts id="4n9khw"
type Status = "loading" | "success" | "error";
```

`interface` cannot do this.

---

## 2. `type` Can Alias Primitive Types

```ts id="r5z7ha"
type ID = string | number;
```

`interface` cannot represent primitives.

---

## 3. `interface` Supports Declaration Merging

You can define the same interface multiple times.

```ts id="c2a2ic"
interface User {
  name: string;
}

interface User {
  age: number;
}

const user: User = {
  name: "Alice",
  age: 25,
};
```

Interfaces automatically merge.

Types cannot:

```ts id="iflcfx"
type User = {
  name: string;
};

// ❌ Error
type User = {
  age: number;
};
```

---

## 4. Extending Types

### Interface Extend

```ts id="6p5rgs"
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
```

### Type Intersection

```ts id="zh5nfp"
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};
```

---

## 5. Classes Prefer Interfaces

```ts id="25xg5x"
interface Printable {
  print(): void;
}

class Report implements Printable {
  print() {
    console.log("printing");
  }
}
```

---

# When to Use Which

## Use `interface` when:

- Defining object/class contracts
- Working with OOP-style code
- Designing public APIs/libraries
- You want declaration merging

```ts id="w0x4tx"
interface Props {
  title: string;
}
```

---

## Use `type` when:

- Using unions
- Creating utility/composed types
- Aliasing primitives
- Working with advanced TypeScript features

```ts id="mfjk1h"
type Theme = "dark" | "light";
```

---

# Modern Recommendation

A common modern convention:

- `interface` → object shapes
- `type` → everything else

Example:

```ts id="td2zjt"
interface User {
  name: string;
}

type Status = "loading" | "success";
```

---

# Performance Note

Historically:

- `interface` was slightly faster for TypeScript compiler
- Difference is negligible in most apps today

---

# Interview Answer (Short)

> `interface` is mainly for object-oriented contracts and supports declaration merging, while `type` is more flexible and can represent unions, primitives, tuples, and advanced type compositions.

---

# Rule of Thumb

If unsure:

```ts id="m8k2w9"
Use interface for objects
Use type for unions/composition
```
