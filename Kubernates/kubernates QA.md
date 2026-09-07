Absolutely. Here’s a **Kubernetes interview Q&A cheat sheet**, focused on the questions commonly asked from beginner → intermediate → advanced levels.

# Kubernetes Interview Q&A

## 🟢 Beginner

### 1. What is Kubernetes?

**Answer:**
Kubernetes is a container orchestration platform used to deploy, manage, scale, and maintain containerized applications.

It handles things like:

* Container scheduling
* Service discovery
* Scaling
* Self-healing
* Rolling deployments
* Configuration/secrets

---

### 2. What is a Pod?

A **Pod is the smallest deployable unit in Kubernetes**.

Usually:

```text
Pod
 └── Container
```

But a Pod can contain multiple tightly coupled containers:

```text
Pod
 ├── Application container
 └── Sidecar container
```

Containers in the same Pod share:

* Network namespace/IP
* Volumes
* Lifecycle

---

### 3. Pod vs Container?

```text
Container = application runtime
Pod       = Kubernetes wrapper around one or more containers
```

Kubernetes schedules **Pods**, not individual containers.

---

### 4. What is a Deployment?

A Deployment manages a set of Pods and provides:

* Replica management
* Rolling updates
* Rollbacks
* Desired-state management

Example:

```yaml
replicas: 3
```

means Kubernetes tries to maintain **3 Pods**.

---

### 5. What is a ReplicaSet?

A ReplicaSet ensures that the desired number of Pod replicas are running.

```text
Deployment
    ↓
ReplicaSet
    ↓
Pods
```

Normally you manage the Deployment rather than creating ReplicaSets directly.

---

# 🟢 Services & Networking

### 6. Why do we need a Kubernetes Service?

Pods are **ephemeral**. Their IP addresses can change.

A Service provides a stable way to access a group of Pods.

```text
Client
  ↓
Service
  ↓
Pod
Pod
Pod
```

---

### 7. What are common Service types?

```text
ClusterIP    → Internal access
NodePort     → Expose through node port
LoadBalancer → External load balancer
ExternalName → DNS-based external service
```

**ClusterIP is the default.**

---

### 8. What is Ingress?

Ingress manages HTTP/HTTPS routing into Kubernetes.

Example:

```text
api.example.com
       ↓
    Ingress
    /      \
 /api      /web
   ↓         ↓
 API       Frontend
 Service   Service
```

Ingress is primarily about **Layer 7 HTTP/HTTPS routing**.

---

### 9. Service vs Ingress?

**Service:**

> Provides stable networking to Pods.

**Ingress:**

> Provides HTTP/HTTPS routing to Services.

---

# 🟡 Scheduling

### 10. What is a Node?

A Node is a worker machine where Kubernetes schedules Pods.

It can be:

* VM
* Physical machine
* Cloud instance

In AWS, for example, a node may be an **EC2 instance**.

---

### 11. What is kubelet?

`kubelet` runs on every worker node.

Its job is essentially:

> "Make sure the Pods assigned to this node are running."

It communicates with the Kubernetes API server and the container runtime.

---

### 12. What is kube-proxy?

`kube-proxy` helps implement Kubernetes Service networking and forwarding rules on nodes.

Modern Kubernetes networking can use different implementations, but conceptually:

```text
Service
   ↓
kube-proxy/network rules
   ↓
Pod
```

---

### 13. What is a taint and toleration?

A **taint** prevents Pods from being scheduled onto a node unless the Pod has a matching **toleration**.

Example:

```text
Node:
gpu=true:NoSchedule
```

Only Pods with the appropriate toleration can be scheduled there.

Think:

> **Taint = keep Pods away**

> **Toleration = Pod is allowed there**

---

### 14. NodeSelector vs NodeAffinity?

Both influence where Pods are scheduled.

**nodeSelector:**

Simple matching.

```yaml
nodeSelector:
  disktype: ssd
```

**nodeAffinity:**

More expressive rules.

For example:

```text
Prefer SSD
OR
Require GPU
```

---

# 🟡 Config & Storage

### 15. ConfigMap vs Secret?

**ConfigMap:**

Non-sensitive configuration.

```text
DATABASE_HOST
LOG_LEVEL
API_URL
```

**Secret:**

Sensitive values.

```text
PASSWORD
TOKEN
API_KEY
```

Important interview point:

> Kubernetes Secrets are not automatically equivalent to strong encryption/security. How they are stored and protected depends on cluster configuration.

---

### 16. What is a PersistentVolume?

A **PersistentVolume (PV)** represents storage available to the Kubernetes cluster.

```text
Pod
 ↓
PVC
 ↓
PV
 ↓
Storage
```

---

### 17. PV vs PVC?

**PV = storage resource**

**PVC = request for storage**

Example:

```text
PVC:
"I need 100Gi"

PV:
"I provide 100Gi"
```

---

# 🟡 Health Checks

### 18. Liveness vs Readiness probe?

This is a **very common interview question**.

### Liveness

> Is the container still healthy/alive?

If it repeatedly fails, Kubernetes may restart the container.

### Readiness

> Is the application ready to receive traffic?

If it fails, the Pod can be removed from Service endpoints while remaining running.

```text
Liveness failure
      ↓
Restart container

Readiness failure
      ↓
Stop sending traffic
```

---

### 19. What is a startup probe?

Startup probe is useful for applications that take a long time to start.

It prevents liveness/readiness checks from killing the application prematurely during startup.

---

# 🔴 Autoscaling

### 20. HPA vs VPA?

**HPA = Horizontal**

```text
5 Pods → 10 Pods
```

**VPA = Vertical**

```text
CPU: 500m → 1 CPU
Memory: 512Mi → 1Gi
```

Remember:

> HPA = **how many Pods?**

> VPA = **how much resource per Pod?**

---

### 21. Does VPA change EC2 instance type?

**No.**

VPA changes Pod resource requests/limits.

```text
VPA:
Pod CPU 500m → 1 CPU
```

It does **not** directly do:

```text
t3.medium → t3.large
```

Node capacity is typically handled by **Karpenter or Cluster Autoscaler**.

---

### 22. HPA with custom metrics?

HPA doesn't have to use CPU.

You can scale using metrics such as:

```text
Requests/sec
Kafka lag
Queue depth
Active connections
Custom application metrics
```

Conceptually:

```text
Desired replicas
≈
Current replicas × Current metric / Target metric
```

---

# 🔴 Production / Troubleshooting

### 23. Pod is stuck in Pending. What do you check?

Good interview answer:

```text
1. kubectl describe pod <pod>
2. Check Events
3. Check node CPU/memory availability
4. Check resource requests
5. Check nodeSelector/affinity
6. Check taints/tolerations
7. Check PVC availability
8. Check scheduler errors
9. Check whether autoscaler/Karpenter can provision a node
```

The **Events** section is especially important.

---

### 24. Pod is in CrashLoopBackOff. What do you check?

```text
kubectl logs <pod>
kubectl logs <pod> --previous
kubectl describe pod <pod>
```

Then investigate:

* Application crash
* Incorrect environment variables
* Missing Secret/ConfigMap
* Dependency unavailable
* Wrong command/entrypoint
* Liveness probe failure
* OOMKilled

---

### 25. What does OOMKilled mean?

The container exceeded its available memory limit and was killed.

Example:

```text
Memory limit = 512Mi
Application uses = 700Mi
```

→ Container may be **OOMKilled**.

---

### 26. Pod is Running but users can't access it. What do you check?

A good troubleshooting flow:

```text
Pod
 ↓
Application listening?
 ↓
Readiness probe?
 ↓
Service selector?
 ↓
Service endpoints?
 ↓
NetworkPolicy?
 ↓
Ingress?
 ↓
Load Balancer?
 ↓
DNS?
```

Useful commands:

```bash
kubectl get pods
kubectl get svc
kubectl get endpoints
kubectl describe svc <service>
kubectl describe ingress <ingress>
```

---

# 🔴 Advanced

### 27. What happens when you run `kubectl apply`?

Simplified flow:

```text
kubectl
   ↓
API Server
   ↓
Authentication / Authorization / Admission
   ↓
etcd stores cluster state
   ↓
Controllers observe desired state
   ↓
Scheduler assigns Pods to nodes
   ↓
kubelet creates/runs containers
```

This architecture is a **very good interview topic**.

---

### 28. What is etcd?

`etcd` is the distributed key-value store used by Kubernetes to store cluster state.

Conceptually:

```text
API Server
    ↓
  etcd
    ↓
Cluster state
```

Losing/compromising etcd can have major consequences for the cluster, so backups are critical.

---

### 29. What is the Kubernetes control plane?

Main components include:

```text
API Server
Scheduler
Controller Manager
etcd
```

Conceptually:

```text
              Control Plane
                   │
       ┌───────────┼───────────┐
       ↓           ↓           ↓
  API Server   Scheduler   Controllers
       │
       ↓
      etcd
```

---

### 30. What is the Scheduler?

The scheduler decides:

> **Which node should run this Pod?**

It considers things such as:

* CPU/memory requests
* Affinity/anti-affinity
* Taints/tolerations
* Topology constraints
* Other scheduling constraints

---

# ⭐ Very Common Scenario Questions

These are worth practicing because interviewers often ask them instead of definitions.

### Scenario 1

**"Your Pod is Running but Service has no traffic. Why?"**

Possible causes:

```text
Service selector doesn't match Pod labels
Pod isn't Ready
Wrong targetPort
NetworkPolicy
Application isn't listening
```

---

### Scenario 2

**"CPU is 90%, but HPA isn't scaling. Why?"**

Check:

```text
HPA configuration
Metrics Server
CPU requests
Current/desired replicas
minReplicas/maxReplicas
HPA events
HPA conditions
```

Important point:

**CPU utilization for HPA is generally calculated relative to the Pod/container CPU requests.**

---

### Scenario 3

**"HPA wants 20 Pods but only 10 are running. Why?"**

Possible reason:

```text
HPA
 ↓
20 desired Pods
 ↓
Not enough node capacity
 ↓
10 Pods Running
10 Pods Pending
 ↓
Karpenter/Cluster Autoscaler should add capacity
```

Then troubleshoot why the pending Pods can't be scheduled/provisioned.

---

### Scenario 4

**"VPA recommends 2 CPU but the node only has 1 CPU available. What happens?"**

The Pod's resource requirement may become unschedulable on the existing node.

Then:

```text
VPA recommendation
        ↓
Pod requires more resources
        ↓
Scheduler can't fit Pod
        ↓
Pod Pending
        ↓
Node autoscaler/Karpenter may provision capacity
```

---

# 🧠 10 Questions I'd Definitely Prepare

If you're preparing for a Kubernetes interview, make sure you can confidently explain:

1. **Pod vs Deployment vs ReplicaSet**
2. **Service vs Ingress**
3. **ClusterIP vs NodePort vs LoadBalancer**
4. **Liveness vs Readiness vs Startup**
5. **ConfigMap vs Secret**
6. **PV vs PVC**
7. **HPA vs VPA vs Karpenter**
8. **What happens when a Pod is Pending?**
9. **What happens when a Pod is CrashLoopBackOff?**
10. **What happens internally after `kubectl apply`?**

The **last 4 are especially good for mid-level DevOps/SRE interviews**, because they test whether you understand Kubernetes as a system rather than just memorizing YAML.
