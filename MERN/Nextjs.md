Here are commonly asked **Next.js interview questions and answers**, covering beginner to advanced topics.

---

# 1. What is Next.js?

**Answer:**
Next.js is a React framework for building full-stack web applications. It provides features like:

* Server-Side Rendering (SSR)
* Static Site Generation (SSG)
* Client-Side Rendering (CSR)
* Incremental Static Regeneration (ISR)
* File-based routing
* API routes
* Image optimization
* Middleware
* Built-in CSS support

---

# 2. Why use Next.js instead of React?

**Answer:**

| React                 | Next.js                |
| --------------------- | ---------------------- |
| UI library            | Full-stack framework   |
| Manual routing        | File-based routing     |
| SEO needs extra setup | Excellent SEO support  |
| No SSR by default     | Built-in SSR           |
| No API routes         | Built-in API routes    |
| Manual optimization   | Automatic optimization |

---

# 3. What are the rendering methods in Next.js?

**Answer:**

### Client-Side Rendering (CSR)

Data loads in the browser after JavaScript executes.

```tsx
useEffect(() => {
  fetch("/api/products")
}, [])
```

**Use when:**

* Dashboards
* User-specific data

---

### Server-Side Rendering (SSR)

Page renders on every request.

```tsx
export async function getServerSideProps() {
  return {
    props: {}
  }
}
```

**Use when:**

* Frequently changing data
* Personalized content

---

### Static Site Generation (SSG)

Page is generated during build.

```tsx
export async function getStaticProps() {
  return {
    props: {}
  }
}
```

**Use when:**

* Blogs
* Documentation
* Landing pages

---

### Incremental Static Regeneration (ISR)

Static page updates after a specified interval.

```tsx
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60
  }
}
```

---

# 4. What is file-based routing?

**Answer:**

Every file inside the `pages` or `app` directory becomes a route.

```
app/
  about/page.tsx

URL:
/about
```

```
app/
  products/
      page.tsx

URL:
/products
```

---

# 5. Difference between Pages Router and App Router?

| Pages Router              | App Router                   |
| ------------------------- | ---------------------------- |
| Uses `pages/`             | Uses `app/`                  |
| Older approach            | Recommended approach         |
| Uses `getServerSideProps` | Uses async Server Components |
| No layouts                | Nested layouts               |
| Limited loading UI        | Built-in loading/error pages |

---

# 6. What are Server Components?

**Answer:**

Server Components run only on the server.

Benefits:

* Smaller JavaScript bundle
* Better SEO
* Faster initial load
* Direct database access
* No API call required

Example:

```tsx
export default async function Products() {
  const data = await fetch("https://api.com/products")
  const products = await data.json()

  return <div>{products.length}</div>
}
```

---

# 7. What are Client Components?

Use:

```tsx
"use client";
```

Required when using:

* `useState`
* `useEffect`
* Browser APIs
* Event handlers

Example:

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

---

# 8. Difference between Server and Client Components?

| Server                   | Client                    |
| ------------------------ | ------------------------- |
| Runs on server           | Runs in browser           |
| Better SEO               | Interactive UI            |
| Can access DB            | Cannot directly access DB |
| Smaller bundle           | Larger bundle             |
| No hooks like `useState` | Supports hooks            |

---

# 9. What is hydration?

**Answer:**

Hydration is the process where React attaches event listeners to server-rendered HTML, making the page interactive.

Flow:

```
Server renders HTML

↓

Browser receives HTML

↓

React hydrates

↓

Buttons become clickable
```

---

# 10. What is dynamic routing?

Example:

```
app/
 products/
    [id]/
       page.tsx
```

URL:

```
/products/10
```

Code:

```tsx
export default function Product({
  params,
}: {
  params: { id: string };
}) {
  return <h1>{params.id}</h1>;
}
```

---

# 11. What is `generateStaticParams()`?

Used to pre-build dynamic routes.

```tsx
export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
  ];
}
```

---

# 12. What is `loading.tsx`?

Shows a loading UI while the page is streaming.

```
app/

dashboard/

loading.tsx

page.tsx
```

---

# 13. What is `error.tsx`?

Handles rendering a fallback UI when a route segment throws an error.

```tsx
"use client";

export default function Error() {
  return <h1>Something went wrong</h1>;
}
```

---

# 14. What is `layout.tsx`?

Shared layout across pages.

```tsx
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
```

---

# 15. What is middleware?

Runs before a request reaches a route.

Common uses:

* Authentication
* Redirects
* Localization
* Header manipulation

Example:

```tsx
import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

---

# 16. What is Image Optimization?

```tsx
import Image from "next/image";

<Image
  src="/cat.jpg"
  width={500}
  height={300}
  alt="Cat"
/>
```

Benefits:

* Lazy loading
* Responsive images
* Automatic resizing
* Modern image formats

---

# 17. What is Link component?

```tsx
import Link from "next/link";

<Link href="/about">
  About
</Link>
```

Benefits:

* Client-side navigation
* Prefetching
* Faster transitions

---

# 18. What is API routing?

**Pages Router:**

```
pages/api/users.ts
```

```tsx
export default function handler(req, res) {
  res.status(200).json({ name: "John" });
}
```

**App Router:**

```
app/api/users/route.ts
```

```tsx
export async function GET() {
  return Response.json({
    name: "John",
  });
}
```

---

# 19. What is data fetching in the App Router?

Server Components can fetch directly:

```tsx
async function getUsers() {
  const res = await fetch("https://api.com/users");
  return res.json();
}

export default async function Page() {
  const users = await getUsers();

  return <div>{users.length}</div>;
}
```

---

# 20. Explain caching in Next.js.

```tsx
fetch(url, {
  cache: "force-cache",
});
```

Options:

* `force-cache` → Cache response (default for static rendering)
* `no-store` → Always fetch fresh data
* `next: { revalidate: 60 }` → Revalidate after 60 seconds

---

# 21. What is Incremental Static Regeneration (ISR)?

ISR allows a statically generated page to be updated after deployment without rebuilding the entire application.

```tsx
fetch(url, {
  next: {
    revalidate: 60,
  },
});
```

---

# 22. What is `useRouter()`?

Used for programmatic navigation.

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <button onClick={() => router.push("/dashboard")}>
      Dashboard
    </button>
  );
}
```

---

# 23. Difference between `redirect()` and `router.push()`?

| `redirect()`               | `router.push()`               |
| -------------------------- | ----------------------------- |
| Server-side                | Client-side                   |
| Works in Server Components | Works in Client Components    |
| Immediate redirect         | Triggered by user interaction |

---

# 24. What are Route Handlers?

They define backend endpoints in the App Router.

```tsx
// app/api/posts/route.ts

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json(body);
}
```

---

# 25. What is `generateMetadata()`?

Used to generate dynamic SEO metadata.

```tsx
export async function generateMetadata() {
  return {
    title: "Products",
    description: "Product page",
  };
}
```

---

# 26. How do you protect routes in Next.js?

Common approaches include:

* Middleware for authentication checks
* Server-side session validation
* Authentication libraries (e.g., NextAuth/Auth.js)
* Redirecting unauthenticated users to a login page

---

# 27. How does Next.js improve SEO?

* Server-side rendering
* Static generation
* Dynamic metadata
* Fast page loading
* Optimized images
* Automatic code splitting

---

# 28. What is code splitting?

Next.js automatically splits JavaScript into smaller chunks so only the code needed for the current page is loaded, reducing bundle size and improving performance.

---

# 29. What is lazy loading?

Load components only when needed.

```tsx
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("./Chart"), {
  loading: () => <p>Loading...</p>,
});
```

---

# 30. What are the advantages of Next.js?

* Excellent SEO
* High performance
* Server Components
* Built-in routing
* API routes
* Image optimization
* Middleware
* Built-in TypeScript support
* Static and dynamic rendering options
* Great developer experience

---

## Frequently Asked Interview Scenario Questions

**Q: When would you use SSR instead of SSG?**
**A:** Use SSR when the content changes on every request or depends on the current user (e.g., dashboards, personalized pages). Use SSG for content that changes infrequently, such as blogs or documentation.

**Q: Why are Server Components faster?**
**A:** They render on the server, reduce the JavaScript sent to the browser, and can fetch data directly without exposing backend logic to the client.

**Q: What causes hydration errors?**
**A:** Common causes include rendering different HTML on the server and client, using browser-only APIs (`window`, `document`) during server rendering, or displaying non-deterministic values like `Date.now()` or `Math.random()` without proper handling.

**Q: What is the difference between `cache: "no-store"` and `revalidate: 60`?**
**A:** `no-store` disables caching and fetches fresh data on every request. `revalidate: 60` caches the response but refreshes it in the background at most once every 60 seconds.

These questions cover the topics most frequently discussed in interviews for developers with roughly 2–5 years of experience working with Next.js.
