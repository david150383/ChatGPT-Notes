In React, Fiber is the internal reconciliation architecture that React uses to manage rendering, updates, and scheduling efficiently.

In simple terms:

React Fiber is the engine behind React's rendering process. It helps React decide what needs to change in the UI, when to update it, and how to prioritize updates.

## 1. Why was Fiber introduced?

Before Fiber, React used an older reconciliation algorithm.

The problem was that rendering could be synchronous and difficult to interrupt.

Imagine:

- A component has 1,000 child components.
- React starts rendering them.
- A high-priority event, such as user input, happens.
- React cannot easily pause the ongoing rendering work to handle that event.

This could cause UI lag.

React Fiber was introduced in React 16 to improve this situation.

## 2. What exactly is Fiber?

Fiber represents a unit of work in React.

Each component in the React tree has an associated Fiber node.

A Fiber node stores information such as:

- Component type
- Current and pending props
- State and Hooks information
- Parent, child, and sibling references
- Effects and update information

Think of Fiber as a data structure that represents a component and the work React needs to perform on it.

## 3. How does React Fiber work?

Unraveling the Threads: A Deep Dive into React Fiber | by NKpeswani | Medium

[medium.com](<https://medium.com/%40nikkipeswani94/unraveling-the-threads-a-deep-dive-into-react-fiber-60f8d187d831?utm_source=chatgpt.com>)

React Fiber broadly works in two phases:

### Phase 1: Render phase

React:

1. Starts processing updates.
2. Creates or updates the Work-in-Progress Fiber tree.
3. Compares the new UI with the previous UI.
4. Determines which changes need to be applied.

Important: This phase can be interrupted, paused, or restarted when React's scheduler needs to prioritize other work.

### Phase 2: Commit phase

React:

1. Applies the required changes to the DOM.
2. Updates references and effects.
3. Completes the update.

The commit phase is synchronous and cannot be interrupted midway.

## 4. Current Fiber tree vs Work-in-Progress Fiber tree

React maintains two important versions of the Fiber tree:

Current Fiber TreeCurrently displayed UI

Represents the committed version of the UI

Work-in-Progress Fiber TreeNext UI being prepared

React processes updates here

Commit React applies changes and the new tree becomes current.

This approach helps React prepare UI updates without immediately changing the currently displayed UI.

## 5. What is the relationship between Fiber and Hooks?

This is an important React interview concept.

Hooks such as:

- `useState`
- `useReducer`
- `useEffect`
- `useMemo`

are associated with a component's Fiber.

For example:

jsx

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

Internally:

1. React maintains a Fiber node for `Counter`.
2. Its Hooks state is stored in a linked list associated with that Fiber.
3. When `setCount` is called, React schedules an update.
4. Fiber processes the update.
5. React commits the resulting UI changes.

## 6. Fiber vs Virtual DOM

These two terms are often confused.

| Virtual DOM | React Fiber |
| --- | --- |
| Conceptual representation of UI | Internal reconciliation architecture |
| Represents UI elements | Represents components and units of work |
| Helps determine UI differences | Manages reconciliation and scheduling |
| Not necessarily a specific data structure | Uses Fiber nodes and linked relationships |

Fiber is not a replacement for the Virtual DOM. It is the architecture React uses to implement reconciliation.

## 7. Important interview questions

Q1. Is Fiber a React Hook?

No. Fiber is an internal React architecture.

Q2. Can Fiber interrupt rendering?

Yes. React can pause, restart, or abandon render work when scheduling requires it. However, the commit phase is synchronous.

Q3. Does Fiber make React faster?

Fiber improves scheduling flexibility and responsiveness. It doesn't automatically make every component render faster.

Q4. When was Fiber introduced?

React 16, released in 2017.

Q5. What is a Fiber node?

An internal JavaScript object representing a unit of work associated with a React component or element.

## Remember this for interviews

React Fiber = Reconciliation + Scheduling

- Fiber node → Unit of work.
- Render phase → Calculate changes.
- Commit phase → Apply changes.
- Current tree → Currently committed UI.
- Work-in-Progress tree → UI being prepared.

Recommended next topic: Understanding how `setState` triggers a React Fiber update, from calling the setter to the actual DOM update. This connects Fiber, Hooks, reconciliation, and rendering into one complete picture.