Angular's **Change Detection** determines when the UI should be updated after data changes. There are two main strategies:

1. **Default**
2. **OnPush**

---

# 1. Default Change Detection

By default, Angular checks **every component** in the component tree whenever change detection runs.

**Triggers include:**

* Button clicks
* HTTP responses
* Timers (`setTimeout`, `setInterval`)
* User input
* Promise or Observable completions (when inside Angular's zone)

### Example

**Parent Component**

```typescript
export class AppComponent {
  count = 0;

  increment() {
    this.count++;
  }
}
```

```html
<button (click)="increment()">Increment</button>

<app-child [count]="count"></app-child>
```

**Child Component**

```typescript
@Component({
  selector: 'app-child',
  template: `<h2>{{ count }}</h2>`
})
export class ChildComponent {
  @Input() count!: number;

  ngDoCheck() {
    console.log('Child checked');
  }
}
```

### What happens?

Every click:

```
Button Click
      ↓
Angular starts change detection
      ↓
Checks AppComponent
      ↓
Checks ChildComponent
      ↓
Updates UI
```

Console:

```
Child checked
Child checked
Child checked
...
```

Even if the child input hasn't changed, Angular still checks the child.

---

# 2. OnPush Change Detection

With `OnPush`, Angular **doesn't check the component on every change detection cycle**. It checks the component only under specific conditions.

```typescript
@Component({
  selector: 'app-child',
  template: `<h2>{{ user.name }}</h2>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent {
  @Input() user!: any;
}
```

---

## When does OnPush run?

### 1. Input reference changes ✅

```typescript
this.user = {
  name: 'John'
};
```

New object reference → Angular updates the child.

---

### 2. Event inside the component ✅

```html
<button (click)="save()">Save</button>
```

Clicking the button triggers change detection for that component.

---

### 3. Observable emits (commonly via the `async` pipe) ✅

```html
{{ user$ | async | json }}
```

When the observable emits, Angular updates the view.

---

### 4. Signal changes (in modern Angular) ✅

If the template reads a Signal, updating that Signal causes Angular to refresh the affected view.

---

# Important Example

### Parent

```typescript
user = {
  name: 'John'
};
```

```html
<app-child [user]="user"></app-child>

<button (click)="changeName()">
Change Name
</button>
```

---

### Child

```typescript
@Component({
  selector: 'app-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  {{user.name}}
  `
})
export class ChildComponent {
  @Input() user!: any;
}
```

---

### Case 1 (Won't Update)

```typescript
changeName() {
   this.user.name = 'David';
}
```

Output:

```
John
```

Why?

Only the object's property changed.

Reference is still the same.

```
Before

user ---->
{
 name:"John"
}

After

user ---->
{
 name:"David"
}
```

The object reference didn't change, so Angular doesn't recheck the `OnPush` child.

---

### Case 2 (Updates)

```typescript
changeName() {
   this.user = {
      ...this.user,
      name: 'David'
   };
}
```

Output:

```
David
```

Why?

A **new object** is created.

```
Old object

user ----> Object A

New object

user ----> Object B
```

Angular detects the new input reference and updates the child.

---

# Default vs OnPush

| Feature                                         | Default                                   | OnPush                              |
| ----------------------------------------------- | ----------------------------------------- | ----------------------------------- |
| Checks every component during change detection  | ✅ Yes                                     | ❌ No                                |
| Checks when input reference changes             | ✅ Yes                                     | ✅ Yes                               |
| Detects object property mutations automatically | ✅ Usually (because it checks every cycle) | ❌ No, unless another trigger occurs |
| Better performance for large apps               | ❌                                         | ✅                                   |
| Encourages immutable data patterns              | ❌                                         | ✅                                   |

---

# Real Interview Question

**Interviewer:** *Why is `OnPush` faster than Default?*

**Answer:**

> In the Default strategy, Angular checks every component whenever change detection runs, even if most data hasn't changed. With `OnPush`, Angular skips checking a component unless one of its update triggers occurs, such as an input reference change, an event in the component, an observable emission (typically via the `async` pipe), or a Signal update. This reduces unnecessary work and improves performance, especially in large applications.

---

# When should you use OnPush?

Use `OnPush` when:

* Your application has many components.
* You treat state as immutable (create new objects instead of mutating existing ones).
* You use RxJS, Signals, or state management libraries.
* You want to reduce unnecessary change detection work and improve rendering performance.

For modern Angular applications, `OnPush` combined with immutable updates and the `async` pipe or Signals is a common performance-oriented approach.
