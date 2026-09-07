A common JavaScript interview question is:

 ### Convert a callback-based function to a Promise

 Suppose you have:

```
function getUser(id, callback) {
  setTimeout(() => {
    if (id > 0) {
      callback(null, { id, name: "John" });
    } else {
      callback(new Error("Invalid ID"));
    }
  }, 1000);
}
```

 Convert it to return a Promise:

```
function getUserPromise(id) {
  return new Promise((resolve, reject) => {
    getUser(id, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
}
```

 Now you can use it with `.then()` / `.catch()`:

```
getUserPromise(1)
  .then(user => {
    console.log(user);
  })
  .catch(error => {
    console.error(error);
  });
```

 Or with `async/await`:

```
async function main() {
  try {
    const user = await getUserPromise(1);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}

main();
```

 ### Interview explanation

 The key pattern is:

```
function promisify(callbackFunction) {
  return new Promise((resolve, reject) => {
    callbackFunction((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
```

 The interviewer may then ask you to write a **generic `promisify()` function** that can convert arbitrary Node.js-style callback functions into Promise-based functions. That is a very common follow-up.