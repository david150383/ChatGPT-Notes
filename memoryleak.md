# 🧠 Memory Leak — ELI5

 ## 🏠 Real-world analogy

 Imagine you have a **small hotel with 100 rooms**.

 Guests check in:

```
100 rooms
↓
20 guests
↓
80 rooms available
```

 When a guest checks out, their room becomes available again.

 Now imagine your receptionist keeps a record saying:

 > “Room 25 still belongs to John.”

 Even though John checked out.

 Then another guest comes:

 > “Give me room 25.”

 The receptionist says:

 > “Sorry, that's still reserved for John.”

 So the room sits empty.

 This happens repeatedly:

```
Guest 1 checks out → room not released ❌
Guest 2 checks out → room not released ❌
Guest 3 checks out → room not released ❌
...
```

 Eventually:

```
100 rooms
↓
0 usable rooms
↓
Hotel can't accept anyone 😵
```

 That's essentially a **memory leak**.

 The computer has memory available, but your program accidentally keeps claiming:

 > **“I still need this memory.”**

 even though it doesn't.

---

 # 💻 Technical explanation

 A memory leak occurs when a program **allocates memory but fails to make it available for reuse after it is no longer needed**.

 For example:

```
const users = [];

function addUser(user) {
  users.push(user);
}
```

 Suppose your application continuously calls:

```
addUser(user1);
addUser(user2);
addUser(user3);
...
```

 but never removes old users.

 The array keeps growing:

```
users
│
├── user1
├── user2
├── user3
├── user4
├── ...
└── millions more
```

 Eventually the application can consume huge amounts of RAM.

---

 # ♻️ What about garbage collection?

 Modern languages such as JavaScript have **garbage collectors (GC)**.

 The GC basically asks:

 > “Can the program still reach this object?”

 If not, it can reclaim the memory.

```
let user = {
  name: "John"
};

user = null;
```

 The original object can now potentially be garbage-collected because nothing references it anymore.

 But this is a leak:

```
const users = [];

function createUser() {
  const user = {
    name: "John"
  };

  users.push(user);
}
```

 Even if you stop using the users, the global `users` array still references them.

 Therefore:

```
users array
    │
    ├──→ user object
    ├──→ user object
    ├──→ user object
    └──→ user object
```

 The garbage collector thinks:

 > “These objects are still reachable, so I can't delete them.”

---

 # 🚨 Common JavaScript memory leaks

 ## 1\. Accidental global data

```
function process() {
  data = new Array(1000000);
}
```

 Depending on the environment/strictness, accidentally creating global state can keep data alive much longer than intended.

 Prefer:

```
function process() {
  const data = new Array(1000000);
}
```

---

 ## 2\. Event listeners

 Imagine:

```
button.addEventListener("click", handleClick);
```

 You repeatedly create components but never remove their listeners.

 You can end up with:

```
Component 1 → listener
Component 2 → listener
Component 3 → listener
Component 4 → listener
...
```

 In frameworks such as React, clean up subscriptions/listeners when appropriate.

```
useEffect(() => {
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

---

 ## 3\. Timers

 This can cause trouble if timers continue running after something is no longer needed:

```
const id = setInterval(() => {
  console.log("Running...");
}, 1000);
```

 Clean it up:

```
clearInterval(id);
```

 In React:

```
useEffect(() => {
  const id = setInterval(doSomething, 1000);

  return () => clearInterval(id);
}, []);
```

---

 ## 4\. Growing caches

 Caching can accidentally become a leak:

```
const cache = new Map();

function save(key, value) {
  cache.set(key, value);
}
```

 If you continuously add unique data:

```
cache
├── key1
├── key2
├── key3
├── ...
├── key1,000,000
└── key1,000,001
```

 Memory keeps growing.

 A real cache often needs:

 - Maximum size
- Expiration (TTL)
- Eviction strategy

---

 # 🧩 Memory leak vs high memory usage

 These aren't necessarily the same.

 ### High memory usage

 Your application legitimately needs a lot of memory:

```
Load huge file
      ↓
Use 4 GB RAM
      ↓
Finish processing
      ↓
Memory released
```

 That's not necessarily a leak.

 ### Memory leak

```
Request 1 → +10 MB
Request 2 → +10 MB
Request 3 → +10 MB
Request 4 → +10 MB
...
```

 and the memory **never comes back down** even though the work is finished.

 Eventually:

```
RAM usage
100% ┤                       ╭────
 80% ┤                  ╭────╯
 60% ┤             ╭────╯
 40% ┤        ╭────╯
 20% ┤   ╭────╯
  0% ┼───╯
     └──────────────────────────→ time
```

 The application may eventually slow down, crash, or be killed by the operating system/container.

---

 # 🎯 The easiest way to remember it

 Think:

 **Memory = hotel rooms**

 **Objects = guests**

 **References = reservation records**

 **Garbage collector = hotel manager**

 A memory leak happens when:

 > **The guest has left, but the hotel still has a reservation saying the room is occupied.**

 So the room can't be reused.

 In programming terms:

 > **Memory is no longer logically needed, but something still holds a reference to it, preventing reclamation.**

 That last sentence is the key concept to remember.