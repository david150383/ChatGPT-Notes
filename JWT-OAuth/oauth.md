Yes. For Laravel, the package you should look at first is **Laravel Passport**. It provides a full OAuth 2.0 authorization server implementation on top of the League OAuth2 Server. The current Laravel 13 documentation supports Authorization Code, PKCE, Client Credentials, scopes, token management, etc. ([Laravel][1])

[Laravel Passport documentation](https://laravel.com/docs/13.x/passport?utm_source=chatgpt.com)

Let's build a small example matching exactly what we've been discussing.

---

# 1. Our architecture

We'll have:

```text
                 AUTH SERVICE
                 Laravel + Passport
                       │
                       │
              Private signing keys
                       │
          ┌────────────┴────────────┐
          │                         │
       User Login             OAuth Clients
          │                         │
          ▼                         ▼
      Main App              Third Party App
          │                         │
          └──────────┬──────────────┘
                     │
                Access Token
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Orders     Payments    Customers
       Laravel    Laravel     Laravel
```

The **Auth Service** is the OAuth Authorization Server.

Your other Laravel applications are **resource servers**.

---

# 2. Install Passport

In your Auth Service:

```bash
composer require laravel/passport
```

Then:

```bash
php artisan install:api --passport
```

Current Laravel documentation uses `install:api --passport` for Passport installation. ([Laravel][1])

Passport creates the database tables it needs for OAuth clients, tokens, etc.

You can then run:

```bash
php artisan migrate
```

---

# 3. Your User model

Your normal Laravel users still exist:

```text
users
----------------
id
name
email
password
```

For example:

```php
class User extends Authenticatable
{
    use \Laravel\Passport\HasApiTokens;
}
```

Passport's `HasApiTokens` trait provides helpers for working with Passport tokens. ([Laravel][1])

And your password should be stored as a hash, never plaintext.

---

# 4. Now create an OAuth client

This is the part you were asking about earlier.

Suppose another company is:

```text
ABC Company
```

You can create an OAuth client for them.

For development/testing:

```bash
php artisan passport:client
```

Passport will ask for information and generate a **client ID and secret**. ([Laravel][1])

Conceptually:

```text
Client Name:
ABC Company Integration

Client ID:
abc-123

Client Secret:
xxxxxxxxxxxxxxxx
```

You give those credentials securely to ABC.

---

# 5. What Passport stores

Instead of you creating your own:

```text
oauth_clients
client_id
client_secret
...
```

Passport provides the OAuth infrastructure and migrations for this.

Conceptually, you have:

```text
users
    │
    ├── John
    ├── Mary
    └── David

oauth_clients
    │
    ├── ABC Company
    ├── XYZ Company
    └── Mobile App

oauth_access_tokens
    │
    ├── token A
    ├── token B
    └── token C
```

That's one of the big benefits: **you don't have to implement all those OAuth mechanisms yourself.**

---

# 6. Third-party → Auth Service

Suppose ABC has:

```text
client_id = abc-123
client_secret = VERY_SECRET
```

They request an access token:

```http
POST https://auth.example.com/oauth/token
Content-Type: application/x-www-form-urlencoded
```

Body:

```text
grant_type=client_credentials
client_id=abc-123
client_secret=VERY_SECRET
scope=orders:read
```

Passport handles the OAuth token endpoint.

The Laravel documentation specifically supports the **Client Credentials grant** for machine-to-machine authentication. ([Laravel][1])

---

# 7. Passport returns the access token

Something conceptually like:

```json
{
    "token_type": "Bearer",
    "expires_in": 3600,
    "access_token": "eyJ..."
}
```

Now ABC has:

```text
access_token
     │
     ▼
eyJhbGciOi...
```

---

# 8. ABC calls your API

ABC sends:

```http
GET https://api.example.com/orders

Authorization: Bearer eyJhbGciOi...
```

Your Order Service verifies the OAuth access token.

With Passport, the route can be protected using Passport's authentication middleware rather than you manually writing:

```php
JWT::decode(...)
```

That is the nice part.

---

# 9. Scopes are very important

This is where OAuth becomes much more powerful than the simple JWT example we built earlier.

Suppose ABC should only be allowed to:

```text
orders:read
orders:create
```

but **not**:

```text
orders:delete
payments:refund
users:delete
```

You can define scopes in Passport.

For example:

```php
Passport::tokensCan([
    'orders:read'   => 'Read orders',
    'orders:create' => 'Create orders',
    'orders:delete' => 'Delete orders',

    'payments:read'   => 'Read payments',
    'payments:create' => 'Create payments',
]);
```

Then an access token can be restricted to:

```text
orders:read
```

---

# 10. Protect your Laravel API

For example:

```php
Route::get('/orders', function () {
    return Order::all();
})->middleware([
    'auth:api',
]);
```

Then you can additionally check the token scope.

Conceptually:

```text
Request
   │
   ▼
Bearer Token
   │
   ▼
Passport
   │
   ├── Token valid? ✓
   ├── Not expired? ✓
   ├── Correct client? ✓
   └── Required scope? ✓
   │
   ▼
Controller
```

Passport provides middleware and helpers for protecting routes and checking scopes. ([Laravel][1])

---

# 11. Now the user-login flow

This is different from ABC's machine-to-machine flow.

Suppose:

```text
John
  │
  ▼
Your Main Application
```

John clicks:

```text
Login
```

Your app redirects him to:

```text
https://auth.example.com/oauth/authorize
```

Passport handles the OAuth authorization endpoint.

The flow becomes:

```text
John
 │
 │ Login
 ▼
Main App
 │
 │ redirect
 ▼
Auth Service
 │
 │ Login page
 │
 │ email + password
 ▼
User authenticated
 │
 │
 ▼
Authorization screen
 │
 │ "Allow Main App?"
 ▼
Authorization Code
 │
 ▼
Main App
 │
 │ exchange code
 ▼
Auth Service
 │
 ▼
Access Token
```

That's the flow you were describing earlier.

---

# 12. For SPA/mobile: PKCE

If the application is a browser SPA or mobile application, don't put a client secret in the frontend.

Use:

```text
Authorization Code + PKCE
```

Passport supports PKCE. Laravel's documentation specifically describes PKCE as the secure approach when a client cannot safely keep a secret. ([Laravel][2])

The simplified flow:

```text
Browser
   │
   │ code_challenge
   ▼
Auth Service
   │
   │ User Login
   ▼
Authorization Code
   │
   ▼
Browser
   │
   │ code + code_verifier
   ▼
Auth Service
   │
   ▼
Access Token
```

No client secret needs to live in the browser.

---

# 13. Service-to-service with Passport

This is probably the most interesting part for your microservices.

Suppose:

```text
Order Service
      │
      │ needs Payment API
      ▼
Payment Service
```

Order Service has OAuth credentials:

```env
OAUTH_CLIENT_ID=order-service
OAUTH_CLIENT_SECRET=xxxxxxxx
```

**Those go in your Secret Manager, not Git.**

Order Service asks Auth Service:

```php
$response = Http::asForm()->post(
    'https://auth.example.com/oauth/token',
    [
        'grant_type' => 'client_credentials',
        'client_id' => config('services.oauth.client_id'),
        'client_secret' => config('services.oauth.client_secret'),
        'scope' => 'payments:create',
    ]
);

$accessToken = $response->json('access_token');
```

Passport handles the `/oauth/token` endpoint. This is the documented Client Credentials flow. ([Laravel][1])

Then:

```php
Http::withToken($accessToken)
    ->post('https://payment.example.com/api/payments', [
        'amount' => 100,
    ]);
```

Payment Service validates the token.

---

# 14. So your three scenarios become very clean

### User → Your Application

```text
User
 ↓
Auth Service
 ↓
Authorization Code + PKCE
 ↓
Access Token
 ↓
Your Application
```

### Your Service → Your Service

```text
Order Service
 ↓
OAuth Client Credentials
 ↓
Auth Service
 ↓
Access Token
 ↓
Payment Service
```

### Third Party → Your API

```text
ABC Company
 ↓
OAuth Client Credentials
 ↓
Auth Service
 ↓
Access Token
 ↓
Your API
```

And if the third party needs to access your API **on behalf of one of your users**:

```text
ABC App
 ↓
Authorization Code + PKCE
 ↓
Your Auth Service
 ↓
User Login / Consent
 ↓
Access Token
 ↓
Your API
```

---

# 15. What you DON'T have to build

This is the important part of using Passport.

You don't want to write all of this yourself:

```text
❌ OAuth /authorize endpoint
❌ OAuth /token endpoint
❌ authorization codes
❌ token generation
❌ token expiration
❌ refresh tokens
❌ client credentials validation
❌ PKCE
❌ OAuth client management
❌ scopes
❌ token revocation
❌ OAuth database tables
```

Passport provides the OAuth 2.0 server implementation and these mechanisms. ([Laravel][1])

You build your **business logic** around it:

```text
Your code
│
├── User management
├── Company management
├── OAuth application approval
├── Which scopes a company gets
├── Admin UI
└── Your APIs
        │
        └── Passport
             │
             └── OAuth 2.0
```

---

## One architectural recommendation

I would make your **Auth Service a separate Laravel application**:

```text
auth-service/
    Laravel
    Passport
    Users
    OAuth clients
    Login
    Authorization
    Token issuance


order-service/
    Laravel
    Resource API
    Token validation


payment-service/
    Laravel
    Resource API
    Token validation
```

So the Auth Service owns the **private signing material** and OAuth state, while the resource services only need the information necessary to validate access tokens.

And don't worry if Passport makes this feel more complicated than the raw JWT example. **That's because OAuth is solving a bigger problem.** For your learning path, I would first build a tiny Passport project with just **(1) user login, (2) one protected API, and (3) Client Credentials for a fake third-party company**. Once those three flows work, OAuth will become much easier to visualize.

[1]: https://laravel.com/docs/13.x/passport?utm_source=chatgpt.com "Laravel Passport | Laravel 13.x - The clean stack for Artisans and agents"
[2]: https://laravel.com/docs/7.x/passport?utm_source=chatgpt.com "Laravel Passport | Laravel 7.x - The clean stack for Artisans and agents"
