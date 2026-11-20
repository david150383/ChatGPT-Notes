In React, both `useState` and `useReducer` are Hooks used to manage component state. The main difference is how they manage state and how complex the state logic is.

## 1. useState

`useState` is best for simple, independent state values.

Syntax:

jsx

```jsx
const [state, setState] = useState(initialValue);
```

Example: Counter

jsx

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}
```

Here:

- `count` holds the current state.
- `setCount` updates the state.
- React re-renders the component when the state changes.

## 2. useReducer

`useReducer` is useful when state logic is more complex or multiple actions update the same state.

Syntax:

jsx

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

It uses three important concepts:

- State: Current data.
- Reducer: Function that decides how state changes.
- Dispatch: Sends an action to the reducer.

Example: Counter

jsx

```jsx
import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };

    case "DECREMENT":
      return { count: state.count - 1 };

    case "RESET":
      return { count: 0 };

    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <div>
      <h2>{state.count}</h2>

      <button onClick={() => dispatch({ type: "INCREMENT" })}>
        Increment
      </button>

      <button onClick={() => dispatch({ type: "DECREMENT" })}>
        Decrement
      </button>

      <button onClick={() => dispatch({ type: "RESET" })}>
        Reset
      </button>
    </div>
  );
}
```

Notice that instead of directly updating state, we dispatch actions. The reducer handles the state updates.

## 3. useState vs useReducer

| Feature | useState | useReducer |
| --- | --- | --- |
| Complexity | Simple | Complex |
| State updates | Setter function | Dispatch actions |
| Logic | Inside event handlers | Inside reducer |
| State structure | Usually simple | Often objects or complex structures |
| Multiple actions | Can become difficult to manage | Easier to organize |
| Debugging | Straightforward | Centralized state logic |
| Best for | Simple state | Complex state transitions |

## 4. When should you use each?

useStateChoose for simple state

- Toggle dark/light mode
- Show/hide a modal
- Input field values
- Counter
- Dropdown open/close

useReducerChoose for complex state

- Shopping cart (add, remove, update quantity)
- Multi-step forms
- Complex form validation
- Todo application with multiple actions
- State with several related properties

## 5. Real-world example: Shopping cart

Imagine a shopping cart with these operations:

- Add product
- Remove product
- Increase quantity
- Decrease quantity
- Clear cart

With `useState`, you might end up writing several state update functions.

With `useReducer`, you can organize everything in one reducer:

jsx

```jsx
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.product];

    case "REMOVE":
      return state.filter(
        item => item.id !== action.id
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}
```

Each action describes what should happen, and the reducer decides how the state changes.

## 6. Important interview question

Can we replace useState with useReducer?

Yes\! Both can manage component state, but they provide different approaches.

- `useState` is simpler and requires less code.
- `useReducer` provides a structured way to handle complex state transitions.

My recommendation: Start with `useState`. When your component has multiple related state updates and increasingly complicated logic, consider switching to `useReducer`.

Remember this simple rule:

> `useState` = Update the state directly using a setter.
>
> `useReducer` = Dispatch an action and let a reducer decide the state update.