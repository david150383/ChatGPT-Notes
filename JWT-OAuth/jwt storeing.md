Yes — your understanding is basically correct, with one important distinction.

 ### Access token (JWT)

 A typical JWT access token is **stateless**:

 1. User logs in.
2. Server generates a JWT.
3. Client sends it with each request.
4. Any backend instance behind the load balancer can validate:
   - Signature
   - Expiration (`exp`)
   - Issuer/audience if you use them
   - Other claims
5. The server doesn't need to look up that JWT in a database.

 So with:

```
              Load Balancer
             /      |      \
          Server A Server B Server C
             \       |       /
              JWT validation
```

 All servers can validate the same JWT as long as they have access to the same signing key/public key.

 ### Refresh token

 Refresh tokens are commonly handled differently.

 You **can store refresh-token state server-side**, for example:

```
MySQL
  |
  +-- user_id
  +-- refresh_token_hash
  +-- expires_at
  +-- revoked
  +-- created_at
```

 Or you can store it in Redis:

```
Redis
  refresh:<token-id> -> user/session information
```

 This is particularly useful because you want to be able to:

 - Revoke a refresh token
- Log a user out
- Detect/reject token reuse
- Rotate refresh tokens
- Manage multiple sessions/devices
- Expire sessions server-side

 ### Does load balancing require storing refresh tokens?

 **No, load balancing itself doesn't require it.**

 The important thing is that all application instances can access the same refresh-token state.

 For example:

```
                  Load Balancer
                 /      |      \
              App A   App B   App C
                 \       |      /
                  Redis / MySQL
                       |
                 Refresh sessions
```

 You don't want:

```
App A -> its own local refresh-token storage
App B -> different local storage
App C -> different local storage
```

 because a refresh request could hit a different server and that server wouldn't know about the session.

 ### Redis vs MySQL

 Both are valid, but they serve slightly different purposes.

 **Redis** is attractive when refresh-token/session data is primarily temporary:

```
refresh token
     ↓
   Redis
     ↓
TTL automatically expires it
```

 It's very fast and has built-in TTL support.

 **MySQL** is useful when you want durable session information and richer querying/auditing:

```
user_id
device
created_at
expires_at
revoked_at
token_hash
ip
user_agent
```

 A common production architecture is actually **both**:

```
                 ┌─────────────┐
                 │ Load Balancer│
                 └──────┬──────┘
                        │
              ┌─────────┼─────────┐
              ↓         ↓         ↓
            App A     App B     App C
              │         │         │
              └─────────┼─────────┘
                        ↓
                    ┌───────┐
                    │ Redis │  ← fast session/token state
                    └───┬───┘
                        │
                    ┌───▼───┐
                    │ MySQL │  ← durable application data
                    └───────┘
```

 One more important point: **don't normally store the raw refresh token in MySQL/Redis**. Store a hash (or an opaque token identifier with appropriate server-side state), so a database/cache leak doesn't immediately give an attacker usable refresh tokens.

 So the simplified mental model is:

 > **Access JWT = stateless verification**\
>  **Refresh token = usually stateful session management**

 And yes, **Redis or MySQL can both be used for that state in a load-balanced system.**