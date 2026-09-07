Absolutely. Let's build a **simple Laravel example with two services**:

* `auth-service` → has the **private key**, creates JWT
* `order-service` → has only the **public key**, validates JWT

We'll use **RS256 (RSA)** so the private key never leaves the Auth Service.

---

# 1. Architecture

```text
                    ┌────────────────────┐
                    │    Auth Service    │
                    │      Laravel       │
                    │                    │
                    │ Private Key 🔐     │
                    └─────────┬──────────┘
                              │
                         Creates JWT
                              │
                              ▼
                           Client
                              │
                   Authorization: Bearer JWT
                              │
                              ▼
                    ┌────────────────────┐
                    │   Order Service    │
                    │      Laravel       │
                    │                    │
                    │ Public Key 🔓      │
                    └────────────────────┘
```

---

# 2. Generate RSA keys

On your machine/server:

```bash
mkdir -p storage/jwt

openssl genrsa -out storage/jwt/private.pem 4096

openssl rsa \
  -in storage/jwt/private.pem \
  -pubout \
  -out storage/jwt/public.pem
```

You'll get:

```text
storage/jwt/
├── private.pem   🔐
└── public.pem    🔓
```

**Do not commit `private.pem`.**

For production, put the private key into your Secret Manager.

---

# 3. Install JWT package

In the Auth Service:

```bash
composer require firebase/php-jwt
```

You could also use a Laravel-specific JWT package, but `firebase/php-jwt` makes the underlying mechanism very clear for learning.

---

# 4. Auth Service

Suppose your Auth Service has:

```text
auth-service/
├── app/
│   └── Http/
│       └── Controllers/
│           └── AuthController.php
├── storage/
│   └── jwt/
│       └── private.pem
└── routes/
    └── api.php
```

### AuthController.php

```php
<?php

namespace App\Http\Controllers;

use Firebase\JWT\JWT;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Normally you would validate the user from your database.
        $user = [
            'id' => 123,
            'email' => 'john@example.com',
            'roles' => ['USER'],
        ];

        $now = time();

        $payload = [
            'iss' => config('app.url'),
            'aud' => 'my-microservices',
            'iat' => $now,
            'exp' => $now + 3600,

            'sub' => $user['id'],
            'email' => $user['email'],
            'roles' => $user['roles'],
        ];

        $privateKey = file_get_contents(
            storage_path('jwt/private.pem')
        );

        $token = JWT::encode(
            $payload,
            $privateKey,
            'RS256',
            'auth-key-2026'
        );

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => 3600,
        ]);
    }
}
```

And:

```php
// routes/api.php

use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
```

---

# 5. Test login

Call:

```http
POST /api/login
```

You might get:

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
}
```

The important thing is:

```text
private.pem
    ↓
Auth Service
    ↓
RS256
    ↓
JWT
```

---

# 6. Order Service

Now we have another completely separate Laravel application:

```text
order-service/
├── app/
│   └── Http/
│       └── Middleware/
│           └── JwtMiddleware.php
├── storage/
│   └── jwt/
│       └── public.pem
└── routes/
    └── api.php
```

Notice:

```text
Auth Service
    private.pem 🔐

Order Service
    public.pem 🔓
```

The Order Service **doesn't have `private.pem`**.

---

# 7. JWT middleware

Create:

```bash
php artisan make:middleware JwtMiddleware
```

Then:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        $header = $request->header('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return response()->json([
                'message' => 'Missing token'
            ], 401);
        }

        $token = substr($header, 7);

        try {
            $publicKey = file_get_contents(
                storage_path('jwt/public.pem')
            );

            $decoded = JWT::decode(
                $token,
                new Key($publicKey, 'RS256')
            );

            // Make decoded JWT available to the request
            $request->attributes->set('jwt', $decoded);

            return $next($request);

        } catch (\Throwable $e) {

            return response()->json([
                'message' => 'Invalid or expired token'
            ], 401);
        }
    }
}
```

This is the important part:

```php
$publicKey = file_get_contents(
    storage_path('jwt/public.pem')
);

$decoded = JWT::decode(
    $token,
    new Key($publicKey, 'RS256')
);
```

The Order Service uses:

```text
JWT + PUBLIC KEY
       ↓
   verify signature
       ↓
     valid?
```

It **doesn't need the private key**.

---

# 8. Protect an Order endpoint

In Laravel, register your middleware according to your Laravel version, then use it on your route.

For example:

```php
use App\Http\Controllers\OrderController;
use App\Http\Middleware\JwtMiddleware;

Route::middleware(JwtMiddleware::class)->group(function () {

    Route::get('/orders', [
        OrderController::class,
        'index'
    ]);

});
```

Now:

```http
GET /api/orders
Authorization: Bearer eyJ0eXAiOiJKV1Qi...
```

goes through:

```text
Request
   │
   ▼
JwtMiddleware
   │
   ├── Get Bearer token
   │
   ├── Get public.pem
   │
   ├── Verify RS256 signature
   │
   ├── Check exp
   │
   └── Decode claims
          │
          ▼
      Controller
```

---

# 9. Get the user from JWT

Remember our Auth Service created:

```php
$payload = [
    'sub' => $user['id'],
    'email' => $user['email'],
    'roles' => $user['roles'],
];
```

After validation, the Order Service can access it:

```php
$jwt = $request->attributes->get('jwt');

$userId = $jwt->sub;
$email = $jwt->email;
$roles = $jwt->roles;
```

For example:

```php
public function index(Request $request)
{
    $jwt = $request->attributes->get('jwt');

    return response()->json([
        'message' => 'Orders returned',
        'user_id' => $jwt->sub,
        'email' => $jwt->email,
    ]);
}
```

---

# 10. Add authorization

Authentication tells us:

> Is this JWT valid?

Authorization asks:

> Is this user allowed to access this endpoint?

For example:

```php
$roles = $jwt->roles ?? [];

if (!in_array('ADMIN', $roles)) {
    return response()->json([
        'message' => 'Forbidden'
    ], 403);
}
```

So:

```text
JWT validation
      ↓
Valid JWT?
  │         │
 NO        YES
  │         │
 401        ▼
       Check role
          │
      ┌───┴───┐
      │       │
     NO      YES
      │       │
     403     200
```

---

# 11. Don't forget `iss` and `aud`

In a real system, you shouldn't only verify the signature.

You should also verify:

```text
Signature ✓
Expiration ✓
Issuer ✓
Audience ✓
Algorithm ✓
```

For example:

```php
$decoded = JWT::decode(
    $token,
    new Key($publicKey, 'RS256')
);

if ($decoded->iss !== config('jwt.issuer')) {
    return response()->json([
        'message' => 'Invalid issuer'
    ], 401);
}

if ($decoded->aud !== 'my-microservices') {
    return response()->json([
        'message' => 'Invalid audience'
    ], 401);
}
```

In production, I'd centralize these checks in your JWT authentication middleware rather than scattering them through controllers.

---

# 12. What happens in deployment?

This connects directly to your previous GitHub Actions question.

### GitHub

```text
GitHub Repository

auth-service/
order-service/
payment-service/

.github/workflows/deploy.yml
```

No:

```text
❌ private.pem
❌ .env.production
❌ database passwords
❌ API secrets
```

### Secret Manager

```text
AWS Secrets Manager

jwt/auth/private-key
database/password
stripe/secret
...
```

### Deployment

```text
GitHub
   │
   │ GitHub Actions
   ▼
Build Docker image
   │
   ▼
Push image
   │
   ▼
Deploy
   │
   ├──────────────┐
   ▼              ▼
Auth Service   Order Service
   │              │
   │              │
   ▼              ▼
Secret Manager   Public Key
   │
   ▼
Private Key 🔐
```

---

# 13. Even better: JWKS

For a small example, `public.pem` is perfectly fine.

For a real microservice architecture, I'd eventually change this:

```text
Order Service
     │
     └── public.pem
```

to:

```text
Order Service
      │
      ▼
https://auth.example.com/.well-known/jwks.json
      │
      ▼
Public keys
```

Then Auth Service can rotate:

```text
key-1
key-2
key-3
```

without you manually copying public keys into every service.

The JWT header contains:

```json
{
    "typ": "JWT",
    "alg": "RS256",
    "kid": "auth-key-2026"
}
```

The `kid` tells the Order Service:

> "Use public key `auth-key-2026` to verify me."

---

## The complete Laravel picture

```text
                   ┌──────────────────┐
                   │   GitHub Repo    │
                   │                  │
                   │ Laravel Code     │
                   │ Dockerfile       │
                   │ GitHub Actions   │
                   └────────┬─────────┘
                            │
                         Deploy
                            │
              ┌─────────────┴──────────────┐
              │                            │
              ▼                            ▼
       ┌──────────────┐             ┌──────────────┐
       │ Auth Laravel │             │ Order Laravel│
       │              │             │              │
       │ Private 🔐   │             │ Public 🔓    │
       └──────┬───────┘             └──────┬───────┘
              │                            │
              │ Sign                       │ Verify
              ▼                            │
             JWT ──────────────────────────┘
              │
              ▼
           Client
```

**The key concept:** the Auth Laravel application can **sign** because it has the private key. The Order Laravel application can only **verify** because it has the public key. That's exactly the security model you want for microservices.
