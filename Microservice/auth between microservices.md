Absolutely. Let's make this concrete with a **Laravel microservice example**. I'll show both approaches, then explain why I'd choose **RS256** for your L2 architecture.

## 1. HS256 — shared secret

This is the simpler approach you already know.

### Architecture

```text
                    Auth Service
                         │
                  SECRET_KEY=abc123
                         │
                         ▼
                    Create JWT
                         │
                         ▼
                       Client
                         │
          Authorization: Bearer JWT
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
     Order Service   Inventory       Payment
          │           Service          Service
          │              │              │
      SECRET_KEY      SECRET_KEY     SECRET_KEY
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                   Verify JWT
```

### Auth Service `.env`

```env id="7t0nqj"
JWT_SECRET=some-very-long-random-secret
```

Auth Service creates a JWT using that secret.

Conceptually:

```php id="w0qv8x"
$token = JWT::encode(
    $payload,
    env('JWT_SECRET'),
    'HS256'
);
```

The token contains something like:

```json id="c5xj1a"
{
    "sub": "123",
    "iss": "auth-service",
    "exp": 1786387200
}
```

The Order Service has the **same secret**:

```env id="i8m7ad"
JWT_SECRET=some-very-long-random-secret
```

Then:

```php id="r8sq2j"
$payload = JWT::decode(
    $token,
    env('JWT_SECRET'),
    ['HS256']
);
```

This works.

### Problem

Every service has the secret:

```text id="j5k5oz"
Order       → can verify + sign
Inventory   → can verify + sign
Payment     → can verify + sign
```

So if the Payment Service is compromised and the secret is stolen, an attacker could potentially create a JWT that the Order Service accepts.

---

# 2. RS256 — public/private key

Now let's change the architecture.

```text id="5p9g0e"
                Private Key 🔐
                     │
                     ▼
                Auth Service
                     │
                  Sign JWT
                     │
                     ▼
                   Client
                     │
                     ▼
              ┌──────┴──────┐
              ▼             ▼
        Order Service   Inventory Service
              │             │
        Public Key 🔓   Public Key 🔓
              │             │
           Verify          Verify
```

### Generate the keys

You generate:

```text id="7lyvxm"
private.pem
public.pem
```

The private key:

```text id="m8l1bv"
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

The public key:

```text id="k0y8na"
-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----
```

**Private key must stay secret.**

The public key can be distributed to your microservices.

---

# 3. Auth Service

Your Auth Service has:

```env id="h0e6p2"
JWT_PRIVATE_KEY=/secure/path/private.pem
JWT_ALGORITHM=RS256
```

Login:

```text id="m5w4o2"
POST /login

email
password
      ↓
Auth Service
      ↓
Validate credentials
      ↓
Create JWT
      ↓
Sign using PRIVATE KEY
      ↓
Return JWT
```

Conceptually:

```php id="y6qz0x"
$token = JWT::encode(
    $payload,
    $privateKey,
    'RS256'
);
```

The important part:

```text id="fr5n7h"
PRIVATE KEY
     ↓
    SIGN
     ↓
   JWT
```

---

# 4. Client calls Order Service

The client gets:

```text id="wq4v1s"
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

Then:

```http id="5d4m4x"
GET /api/orders/123
Authorization: Bearer eyJhbGciOi...
```

The Order Service receives the request.

---

# 5. Order Service validates JWT

Order Service has **only the public key**:

```env id="m4q9wz"
JWT_PUBLIC_KEY=/secure/path/public.pem
JWT_ALGORITHM=RS256
```

It does:

```php id="v2e6dx"
$payload = JWT::decode(
    $token,
    $publicKey,
    ['RS256']
);
```

Conceptually:

```text id="2h6t5k"
JWT
 │
 ▼
Order Service
 │
 │ Public Key
 ▼
Verify signature
 │
 ├── Invalid → 401 Unauthorized
 │
 └── Valid
       ↓
Check exp
Check iss
Check aud
Check scopes
       ↓
Allow request
```

Notice:

**Order Service never has the private key.**

---

# 6. What should be inside the JWT?

For example:

```json id="f5b3v7"
{
    "iss": "https://auth.example.com",
    "sub": "12345",
    "aud": "order-service",
    "iat": 1786386000,
    "exp": 1786386900,
    "scope": "orders:read orders:write"
}
```

Important claims:

| Claim   | Meaning              |
| ------- | -------------------- |
| `iss`   | Who issued the token |
| `sub`   | User identity        |
| `aud`   | Intended audience    |
| `iat`   | Issued-at time       |
| `exp`   | Expiration           |
| `scope` | Permissions/scopes   |

You shouldn't blindly trust a JWT just because the signature is valid.

You should validate things like:

```text
Signature ✓
Issuer ✓
Audience ✓
Expiration ✓
Required scope ✓
```

---

# 7. Where does the public key come from?

You have two options.

### Option A — Deploy public key to services

```text id="6p9r7f"
Auth Service
    │
    └── public.pem
          │
          ├── Order Service
          ├── Inventory Service
          └── Payment Service
```

Very simple and cheap.

But rotating keys requires updating services.

### Option B — JWKS endpoint

A more scalable approach is:

```text id="w5b7e9"
Auth Service
     │
     └── /.well-known/jwks.json
                  │
        ┌─────────┼──────────┐
        ↓         ↓          ↓
      Order   Inventory    Payment
```

Each service can retrieve and cache the public keys.

When you rotate keys, you publish the new public key with a different `kid`.

The JWT header might contain:

```json id="x2g9a1"
{
    "alg": "RS256",
    "typ": "JWT",
    "kid": "key-2026-01"
}
```

The service uses `kid` to select the correct public key.

---

# 8. Laravel middleware

In your Laravel Order Service, I would hide all this behind middleware.

For example:

```php id="9z6q2w"
Route::middleware('jwt.auth')->group(function () {
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
});
```

Conceptually the middleware does:

```text id="t8u4qk"
Request
   ↓
Extract Bearer token
   ↓
Decode JWT
   ↓
Verify RS256 signature
   ↓
Validate iss
   ↓
Validate aud
   ↓
Validate exp
   ↓
Check required scope
   ↓
Attach user identity
   ↓
Controller
```

Then your controller can access the authenticated user:

```php id="z1m8qf"
$userId = auth()->id();
```

---

# 9. Very important: Authentication vs authorization

Let's say:

```text id="n4v5mc"
JWT:
sub = user-123
scope = orders:read
```

The JWT is valid.

Now user calls:

```http id="pr8w0x"
DELETE /orders/999
```

The Order Service should still check:

```text id="4g6xk1"
Is user-123 allowed to delete order 999?
```

Maybe:

```text id="0x7nq4"
Order 999 belongs to user-456
```

Then:

```text id="x4j2w8"
JWT valid ✓
Authentication ✓

Business authorization ✗

→ 403 Forbidden
```

This is why **authentication doesn't replace authorization**.

---

# 10. Your final architecture

For your interview, I'd recommend drawing this:

```text
                         ┌─────────────────┐
                         │   Auth Service  │
                         │     Laravel     │
                         │                 │
                         │ Private Key 🔐  │
                         └────────┬────────┘
                                  │
                              Login
                                  │
                                  ▼
                               Client
                                  │
                         Bearer JWT / RS256
                                  │
                   ┌──────────────┼──────────────┐
                   ▼              ▼              ▼
             Order Service   Inventory       Payment
                Laravel       Laravel         Laravel
                   │              │              │
             Public Key 🔓  Public Key 🔓  Public Key 🔓
                   │              │              │
                Verify          Verify          Verify
                   │              │              │
                   ▼              ▼              ▼
              Authorization / Business Logic
```

And if they ask **"Why RS256 instead of HS256?"**, give this:

> **“HS256 uses a shared secret, so every service that verifies tokens also has the ability to sign tokens. That's acceptable for a simple trusted environment, but in a microservice architecture I prefer RS256. The Auth Service owns the private key and signs tokens, while individual services only receive the public key and can verify them. This reduces the blast radius if one service is compromised and makes key management cleaner.”**

### One final recommendation

For a real production Laravel application, **don't implement JWT cryptography yourself**. Use a well-maintained Laravel/OAuth2/OIDC library or established identity provider. Your architectural responsibility is deciding **where authentication happens, how keys are managed, token lifetime, revocation, and service authorization**—not writing the cryptographic implementation yourself.
