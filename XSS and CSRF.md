XSS vs. CSRF

Both are web security vulnerabilities, but they abuse different trust relationships:

	XSS	CSRF
Stands for	Cross-Site Scripting	Cross-Site Request Forgery
Main idea	Attacker gets their JavaScript to run in your site	Attacker tricks your browser into sending an unwanted request
Exploits	Trust between the user and the website	Trust between the website and the user's browser
Usually requires	Some form of injected/unsafe content	Victim already authenticated to the target site
Typical impact	Account takeover, data theft, actions as victim	Unauthorized actions using victim's privileges
XSS

Suppose a site displays a user's comment without safely encoding it:

<div>Hello, USER_INPUT</div>


An attacker might submit something like:

<script>
  // malicious JavaScript
</script>


If the application inserts that as HTML rather than treating it as text, the browser executes it in the context of your website.

XSS can potentially allow an attacker to:

Read sensitive information accessible to JavaScript.
Make requests to the application as the victim.
Modify what the victim sees.
Perform actions available to the victim.
Steal sensitive tokens if they are exposed to JavaScript.
Capture information entered into vulnerable pages.
Potentially lead to account takeover.

There are three common varieties:

Stored XSS: malicious content is saved by the server and later delivered to other users.
Reflected XSS: malicious input is immediately reflected in a response.
DOM-based XSS: client-side JavaScript unsafely processes attacker-controlled data.
Protecting against XSS

The most important defense is context-aware output encoding.

For example, if you're putting user input into HTML text, encode it so < becomes &lt;, etc., rather than interpreting it as markup.

Also:

Prefer safe DOM APIs such as textContent instead of innerHTML when you want to insert text.
Sanitize HTML if users genuinely need to submit HTML, using a well-maintained sanitizer.
Use framework escaping correctly; don't unnecessarily disable it.
Validate input where appropriate, but don't rely on input validation as your primary XSS defense.
Use a strong Content Security Policy (CSP) as an additional layer.
Mark sensitive cookies HttpOnly so JavaScript cannot directly read them.
Use Secure cookies so they aren't sent over plain HTTP.

A useful rule is:

Treat all user-controlled data as untrusted until it is safely handled for the context in which it is used.

CSRF

Imagine you're logged into:

bank.example


Your browser has a session cookie for that site.

You then visit an attacker's website. That page could attempt to cause your browser to send a request to the bank—for example, a request that changes an account setting.

Historically, browsers automatically attached cookies to such requests, so the bank might see:

"This request has the victim's valid session cookie."

The attacker doesn't necessarily need to know the victim's password or steal the response. They just want the victim's browser to perform an action.

CSRF can potentially cause:

Password/email changes.
Purchases or transfers.
Account-setting changes.
Creation/deletion of resources.
Other state-changing actions available to the victim.

The key distinction is:

XSS: "Run my code on your website."

CSRF: "Make your browser perform an action on this website."

Protecting against CSRF
1. Use CSRF tokens

For state-changing requests, the server generates a secret, unpredictable token and requires it in the request.

Conceptually:

POST /change-email

email=new@example.com
csrf_token=random-secret-value


The server verifies the token before performing the action.

An attacker's external site shouldn't be able to obtain the legitimate token.

2. Use SameSite cookies

Modern applications should generally configure session cookies appropriately, for example:

Set-Cookie: session=...; Secure; HttpOnly; SameSite=Lax


SameSite limits when browsers send cookies in cross-site situations.

For particularly sensitive applications, cookie configuration should be chosen deliberately based on the application's authentication and cross-site requirements.

3. Check the Origin / Referer headers

For sensitive operations, the server can verify that the request originated from an expected site.

For example:

Origin: https://your-app.example


This can provide another useful defense layer.

4. Don't use GET for state-changing operations

Prefer:

GET /profile


for retrieving information, and:

POST /change-email


for changing something.

Don't design an application where simply visiting:

GET /delete-account


performs a destructive operation.

Important: XSS can defeat many CSRF defenses

This is one of the most important things to understand.

Suppose your application has excellent CSRF tokens. An attacker nevertheless discovers XSS.

Their JavaScript is now executing inside your application's origin. It may be able to interact with the application as the victim and potentially obtain/use CSRF tokens.

So:

CSRF defenses don't compensate for XSS.

And HttpOnly doesn't solve everything either. HttpOnly prevents JavaScript from directly reading a cookie, but an XSS payload may still be able to make authenticated requests from the victim's browser.

A good layered defense

For a modern web application:

Escape/encode untrusted output correctly → primary XSS defense.
Use safe DOM APIs and sanitize HTML when necessary.
Use CSP → limits damage from XSS.
Use HttpOnly; Secure for sensitive cookies.
Use SameSite cookies.
Use CSRF tokens for state-changing requests where appropriate.
Validate Origin/Referer for sensitive operations.
Use POST/PUT/PATCH/DELETE rather than GET for state changes.
Keep frameworks and dependencies patched.

A simple mental model:

XSS = attacker-controlled code executes in your origin.
CSRF = attacker's site causes your browser to send a request to your origin.