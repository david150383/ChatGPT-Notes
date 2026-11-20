In Express.js, both `res.send()` and `res.json()` are used to send responses from the server to the client, but they differ in how they handle the response data.

## 1. res.send()

`res.send()` is a general-purpose method used to send different types of responses.

It can send:

- Strings
- HTML
- Objects
- Arrays
- Buffers

Example:

js

```js
app.get("/", (req, res) => {
  res.send("Hello World");
});
```

Sending HTML:

js

```js
app.get("/home", (req, res) => {
  res.send("<h1>Welcome Home</h1>");
});
```

Sending an object:

js

```js
app.get("/user", (req, res) => {
  res.send({
    name: "John",
    age: 25
  });
});
```

When you send an object or array, Express serializes it as JSON.

## 2. res.json()

`res.json()` is specifically designed to send JSON responses.

It converts the supplied JavaScript value into a JSON string and sets the appropriate content type.

Example:

js

```js
app.get("/user", (req, res) => {
  res.json({
    name: "John",
    age: 25
  });
});
```

Response:

json

```json
{
  "name": "John",
  "age": 25
}
```

The response Content-Type is:

http

```http
Content-Type: application/json; charset=utf-8
```

## 3. Main differences

| Feature | res.send() | res.json() |
| --- | --- | --- |
| Purpose | General response | JSON response |
| String | Yes | Yes, serialized as JSON string |
| HTML | Yes | No, treated as JSON string |
| Object | Yes, serialized as JSON | Yes, serialized as JSON |
| Array | Yes, serialized as JSON | Yes, serialized as JSON |
| Buffer | Yes | Not intended for binary responses |
| Content-Type | Depends on data | application/json |

## 4. Important difference with strings

Consider these two examples:

Using res.send():

js

```js
res.send("Hello");
```

Response body:

text

```text
Hello
```

Content-Type:

http

```http
Content-Type: text/html; charset=utf-8
```

Using res.json():

js

```js
res.json("Hello");
```

Response body:

json

```json
"Hello"
```

Content-Type:

http

```http
Content-Type: application/json; charset=utf-8
```

Notice the difference:

- `res.send("Hello")` sends plain text.
- `res.json("Hello")` sends a JSON string, including quotation marks.

## 5. Can we use res.send() instead of res.json()?

Yes\!

For example:

js

```js
res.send({ name: "John" });
```

And:

js

```js
res.json({ name: "John" });
```

Both send a JSON response in Express.

However, when building REST APIs, prefer `res.json()` because:

- It clearly communicates that you're returning JSON.
- It explicitly sets the JSON content type.
- It makes your API code easier to understand.

## 6. Interview question

Q: Is res.json() internally using JSON.stringify()?

Yes. Express serializes the JavaScript value into JSON internally (using its JSON serialization implementation), then sends the resulting response.

Q: Which one should you use for REST APIs?

Prefer `res.json()` for JSON API responses and `res.send()` for general-purpose responses such as HTML, text, or buffers.

Remember:

`res.send()` = Send different types of responses.

`res.json()` = Specifically send JSON responses.