# XSS vs. CSRF

Both **Cross-Site Scripting (XSS)** and **Cross-Site Request Forgery (CSRF)** are web security vulnerabilities, but they exploit different trust relationships.

## 1\. XSS vs. CSRF: Key Differences

| Aspect | XSS | CSRF |
| --- | --- | --- |
| **Stands for** | Cross-Site Scripting | Cross-Site Request Forgery |
| **Main idea** | An attacker gets their JavaScript to run on your website. | An attacker tricks your browser into sending an unwanted request. |
| **Exploits** | Trust between the user and the website. | Trust between the website and the user's browser. |
| **Usually requires** | Some form of injected or unsafe content. | The victim is typically authenticated to the target website. |
| **Typical impact** | Account takeover, data theft, and actions performed as the victim. | Unauthorized actions using the victim's privileges. |

---

## 2\. Cross-Site Scripting (XSS)

### How XSS Works

Suppose a website displays a user's comment without safely encoding it:

HTMLWrap linesCopy codePreview

```
<div>Hello, USER_INPUT</div>
```

An attacker might submit something like:

HTMLWrap linesCopy codePreview

```
<script>
  // Malicious JavaScript
</script>
```

If the application inserts this input as HTML rather than treating it as text, the browser may execute the JavaScript in the context of the website.

### Potential Impact of XSS

XSS can potentially allow an attacker to:

- Read sensitive information accessible to JavaScript.
- Make requests to the application as the victim.
- Modify what the victim sees.
- Perform actions available to the victim.
- Steal sensitive tokens if they are exposed to JavaScript.
- Capture information entered into vulnerable pages.
- Potentially take over the victim's account.

### Types of XSS

There are three common types of XSS:

1. **Stored XSS:** Malicious content is saved by the server and later delivered to other users.
2. **Reflected XSS:** Malicious input is immediately reflected in a server response.
3. **DOM-based XSS:** Client-side JavaScript unsafely processes attacker-controlled data, causing the browser DOM to be modified in an unsafe way.

### Protecting Against XSS

The most important defense is **context-aware output encoding**.

For example, when inserting user input into HTML text, encode special characters so that `<` becomes `&lt;` and is treated as text rather than markup.

Additional defenses include:

- **Prefer safe DOM APIs:** Use `textContent` instead of `innerHTML` when inserting plain text.
- **Sanitize HTML:** If users genuinely need to submit HTML, use a well-maintained HTML sanitizer.
- **Use framework escaping correctly:** Avoid unnecessarily disabling built-in output escaping.
- **Validate input where appropriate:** Do not rely on input validation as your primary XSS defense.
- **Implement a strong Content Security Policy (CSP):** Use it as an additional layer of protection.
- **Use****`HttpOnly`****cookies:** Prevent JavaScript from directly reading sensitive cookies.
- **Use****`Secure`****cookies:** Ensure cookies are sent only over HTTPS.

> **Rule of thumb:** Treat all user-controlled data as untrusted until it is safely handled for the context in which it is used.

---

## 3\. Cross-Site Request Forgery (CSRF)

### How CSRF Works

Imagine you are logged into:

```
bank.example
```

Your browser has a session cookie for that website.

You then visit an attacker's website. That page could attempt to make your browser send a request to the bank, such as a request to change an account setting.

Historically, browsers automatically attached cookies to many such requests. The bank might therefore receive a request containing the victim's valid session cookie and assume that the request is authenticated.

The attacker does not necessarily need to know the victim's password or read the response. The goal is to make the victim's browser perform an unauthorized action.

### Potential Impact of CSRF

CSRF can potentially cause:

- Password or email changes.
- Unauthorized purchases or transfers.
- Account-setting changes.
- Creation or deletion of resources.
- Other state-changing actions available to the victim.

### The Key Distinction

- **XSS:** "Run my code on your website."
- **CSRF:** "Make your browser perform an action on this website."

### Protecting Against CSRF

#### 1\. Use CSRF Tokens

For state-changing requests, the server generates a secret, unpredictable token and requires it to be included in the request.

Conceptually:

```
POST /change-email
Content-Type: application/x-www-form-urlencoded
```

Request body:

```
email=new@example.com
csrf_token=random-secret-value
```

The server verifies the token before performing the requested action.

An attacker's external website should not be able to obtain the legitimate token through ordinary cross-origin browser access.

#### 2\. Use `SameSite` Cookies

Modern applications should configure session cookies appropriately. For example:

```
Set-Cookie: session=...; Secure; HttpOnly; SameSite=Lax
```

`SameSite` limits when browsers send cookies in cross-site contexts, helping reduce CSRF risk.

For particularly sensitive applications, cookie settings should be chosen deliberately based on authentication and cross-site requirements.

#### 3\. Check the `Origin` and `Referer` Headers

For sensitive operations, the server can verify that a request originated from an expected site.

For example:

```
Origin: https://your-app.example
```

The server should compare the header against an expected origin and reject unexpected origins where appropriate.

This provides another useful layer of defense.

#### 4\. Don't Use GET for State-Changing Operations

Use `GET` to retrieve information:

```
GET /profile
```

Use appropriate state-changing methods, such as `POST`, `PUT`, `PATCH`, or `DELETE`, for operations that modify data:

```
POST /change-email
```

Avoid designing an application where simply visiting the following URL performs a destructive operation:

```
GET /delete-account
```

**Important:** Using `POST` instead of `GET` does not, by itself, prevent CSRF. State-changing requests still need appropriate CSRF protections.

---

## 4\. Important: XSS Can Defeat Many CSRF Defenses

This is one of the most important concepts to understand.

Suppose your application has excellent CSRF token protection, but an attacker discovers an XSS vulnerability.

The attacker's JavaScript can now execute within your application's origin. Depending on the vulnerability and the application's defenses, it may be able to interact with the application as the victim and obtain or use CSRF tokens.

Therefore:

- CSRF defenses do not compensate for XSS.
- `HttpOnly` does not eliminate the risk of XSS.
- An XSS payload may still make authenticated requests from the victim's browser, even if it cannot directly read the session cookie.

`HttpOnly` prevents JavaScript from reading a cookie directly; it does not prevent JavaScript running in the application's origin from making requests that include that cookie.

---

## 5\. A Layered Defense for Modern Web Applications

Use multiple defenses together:

- **Encode untrusted output correctly:** The primary defense against XSS.
- **Use safe DOM APIs:** Avoid unsafe HTML insertion.
- **Sanitize HTML when necessary:** Use a well-maintained sanitizer for permitted user-generated HTML.
- **Implement CSP:** Reduce the impact of certain XSS attacks.
- **Configure sensitive cookies:** Use `HttpOnly` and `Secure`.
- **Use****`SameSite`****cookies:** Reduce exposure to cross-site cookie-based requests.
- **Use CSRF tokens:** Protect state-changing requests where appropriate.
- **Validate****`Origin`****and****`Referer`****:** Add checks for sensitive operations.
- **Use appropriate HTTP methods:** Do not use `GET` for state-changing operations.
- **Keep frameworks and dependencies patched:** Reduce exposure to known vulnerabilities.

---

## 6\. Simple Mental Model

| Vulnerability | Mental Model |
| --- | --- |
| **XSS** | Attacker-controlled code executes in your website's origin. |
| **CSRF** | An attacker's website causes your browser to send a request to another website where you are authenticated. |

**In short:**

- **XSS compromises the execution context.**
- **CSRF abuses the browser's authenticated request behavior.**

Both should be addressed as part of a comprehensive web application security strategy.