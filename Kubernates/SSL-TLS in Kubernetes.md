SSL/TLS in Kubernetes is mainly used to secure communication between:

- Client → Ingress
- Service → Service
- Pod → Pod
- External users → Applications
- Kubernetes components themselves

In Kubernetes, SSL is usually terminated or managed at the:

- Ingress Controller
- Service Mesh
- Application container
- API Server

---

# First: Important Clarification

In Kubernetes:

- A **Service** itself usually does NOT handle SSL directly.
- SSL/TLS is commonly handled by:
  - Ingress Controller
  - Reverse Proxy
  - Service Mesh
  - Application server

---

# Typical HTTPS Flow in Kubernetes

```text id="b0tn0u"
User Browser
     │ HTTPS
     ▼
Ingress Controller
(NGINX / Traefik)
     │ HTTP or HTTPS
     ▼
Kubernetes Service
     ▼
Pods
```

---

# Main SSL Approaches in Kubernetes

There are mainly 4 patterns:

1. TLS Termination at Ingress
2. End-to-End TLS
3. Mutual TLS (mTLS)
4. Service Mesh TLS

---

# 1. TLS Termination at Ingress (Most Common)

This is the standard approach.

The Ingress Controller:

- receives HTTPS traffic
- decrypts SSL
- forwards normal HTTP internally

---

## Flow

```text id="5js87r"
Browser
   │ HTTPS
   ▼
Ingress Controller
   │ HTTP
   ▼
Service
   ▼
Pods
```

---

# How It Works

## Step 1: TLS Certificate

You create a Kubernetes Secret containing:

- certificate
- private key

Example:

```bash id="g6s8lx"
kubectl create secret tls my-tls-secret \
  --cert=cert.pem \
  --key=key.pem
```

---

## Step 2: Configure Ingress

Example:

```yaml id="a9hn7d"
apiVersion: networking.k8s.io/v1
kind: Ingress

metadata:
  name: app-ingress

spec:
  tls:
    - hosts:
        - myapp.com
      secretName: my-tls-secret

  rules:
    - host: myapp.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
```

---

# What Happens Internally

When user opens:

```text id="4mny4u"
https://myapp.com
```

The Ingress:

1. Performs TLS handshake
2. Uses certificate from Secret
3. Decrypts traffic
4. Routes request to Service

---

# Advantages

- Simple
- Fast
- Centralized SSL management
- Easy certificate renewal

---

# Disadvantage

Traffic inside cluster may remain unencrypted.

---

# 2. End-to-End TLS

Here HTTPS remains encrypted all the way to Pods.

---

## Flow

```text id="6xq4f2"
Browser
   │ HTTPS
   ▼
Ingress
   │ HTTPS
   ▼
Service
   ▼
Pod
```

---

# How It Works

- Ingress forwards encrypted traffic
- Application pod itself handles TLS

Pod contains:

- certificate
- private key

Example:

- Spring Boot HTTPS
- Node.js HTTPS server
- NGINX pod with SSL

---

# Benefits

- Full encryption
- Better security
- Compliance requirements

---

# Drawbacks

- More complex
- Certificate management harder

---

# 3. Mutual TLS (mTLS)

This secures service-to-service communication.

Both client and server verify each other.

---

# Normal TLS

Only server proves identity.

```text id="k7n8m0"
Client verifies Server
```

---

# mTLS

Both verify each other.

```text id="g29c1k"
Client verifies Server
Server verifies Client
```

---

# Flow Example

```text id="z9md5o"
Payment Service
   ↔ mTLS ↔
Order Service
```

---

# Why Important?

Prevents:

- fake services
- unauthorized communication
- lateral attacks

---

# Commonly Implemented Using

- Istio
- Linkerd
- Consul Connect

---

# 4. Service Mesh TLS

Modern Kubernetes setups often use Service Mesh.

Example:

- Istio
- Linkerd

These inject:

- sidecar proxies

---

# Flow

```text id="3mwqpk"
Pod A App
   │
Sidecar Proxy
   ↔ encrypted ↔
Sidecar Proxy
   │
Pod B App
```

Applications don't handle TLS directly.

The mesh automatically:

- encrypts traffic
- rotates certificates
- manages identities

---

# Huge Advantage

Developers don't write TLS logic manually.

---

# SSL Components in Kubernetes

| Component    | Role                        |
| ------------ | --------------------------- |
| Ingress      | TLS termination             |
| Secret       | Stores cert/key             |
| Service      | Internal networking         |
| Pod/App      | Optional HTTPS handling     |
| Service Mesh | Automatic mTLS              |
| cert-manager | Auto certificate management |

---

# Kubernetes Secret for TLS

TLS certs are usually stored as:

```yaml id="jjqj4g"
kind: Secret
type: kubernetes.io/tls
```

Contains:

- tls.crt
- tls.key

---

# cert-manager (Very Important)

Most production clusters use:

cert-manager

It automates:

- Let's Encrypt certificates
- renewal
- rotation

---

# Example Flow with cert-manager

```text id="hcz99h"
cert-manager
    ↓
Requests certificate
    ↓
Let's Encrypt
    ↓
Stores in Kubernetes Secret
    ↓
Ingress uses Secret
```

---

# SSL Handshake in Kubernetes

When browser connects:

1. Client sends "Hello"
2. Server sends certificate
3. Client validates certificate
4. Session key generated
5. Encrypted communication begins

This process is same inside/outside Kubernetes.

---

# Internal Kubernetes Component TLS

Kubernetes itself heavily uses TLS:

| Component      | TLS Usage                 |
| -------------- | ------------------------- |
| kube-apiserver | HTTPS API                 |
| kubelet        | Secure node communication |
| etcd           | Encrypted cluster data    |
| kubectl        | Client cert auth          |

---

# Common Production Setup

Most companies use:

```text id="sjfdrj"
Internet
   ↓ HTTPS
NGINX Ingress
   ↓ HTTP
Service
   ↓
Pods
```

Advanced setups use:

```text id="8s8yxv"
Istio Service Mesh
   ↓
Automatic mTLS everywhere
```

---

# Common Ingress Controllers

Popular controllers:

- NGINX Ingress Controller
- Traefik
- HAProxy Ingress
- Istio

---

# Common Problems

## 1. Expired Certificates

Fix:

- cert-manager
- auto-renewal

---

## 2. Mixed HTTP/HTTPS

Can cause:

- redirect loops
- insecure traffic

---

## 3. Wrong TLS Secret

Ingress fails if:

- cert mismatch
- invalid hostname

---

## 4. Internal Traffic Unencrypted

Solution:

- mTLS
- service mesh

---

# Simple Mental Model

Think of Kubernetes SSL like this:

```text id="on0p08"
Ingress = Security Gate
Service = Traffic Router
Pod = Actual Application
```

SSL usually terminates at the gate.

---

# Interview-Friendly Definition

> SSL/TLS in Kubernetes secures communication between clients, services, and pods using Ingress controllers, TLS secrets, service meshes, and mutual TLS mechanisms. TLS is commonly terminated at the Ingress or managed automatically through service meshes like Istio.
