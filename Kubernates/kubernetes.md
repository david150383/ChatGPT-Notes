# Kubernetes

## What features do orchestration tools offer ?
1. High Availability or no downtime
2. Scalability or high performance
3. Disaster recovery -  backup and restore

Website can run with latest state after data recovery 

---

## Main kubernetes components
- Pod
- Volumes
- Service
- Ingress
- Secrets
- Statefulset
- ConfigMap
- Deployment

### 1. Pod
Smallest unit of K8s
Abstraction over container : it create layer top of container (docker container)
Usually 1 application per Pod 
Each Pod gets its own IP address : each pod communicate using IP address
New IP address on re-creation
For example My-app and db inside this two pod both two containers in on Node 1, in case db crash it will automatic create new one in place of that with new IP, so as new ip on re creation so we use service component to manage this.

### 2. Service
Permanent IP address
Lifecycle of Pod and Service not connected, so in case new db pod created service will hold old IP address to connect with others 
External service : http://124.89.101.2:8080
Internal service : http://db-service-ip:port
Work as load balancer : it catch the request and forward it to which ever pod least busy 


### 3. Ingress
To open service with domain we have ingress component 
https://My-app.com

### 4. ConfigMap
My-app (pod 1) using mongo-db-service (pod 2), Database Url usually in the built application, for example if end point (name ) of mongo-db-service change to mongo-db then in this case we need to re build new version, push it to repo, pull it in your pod and start everything. So for resolve this small change we have configMap. This is like 
external configuration of your application
For example DB_URL = mongo-db

Don’t put credentials into ConfigMap in plan text because it will in insecure, Like db username and password, so resolve this K8s have another component called Secret

### 5. Secret 
Used to store secret data
Base64 encoded 
This built-in security mechanism is not enabled by default
Use it as environment variables r as a properties file

### 6. Volumes
In case of database container or pod restarted data will be gone. We need our database data or log data persistence   
Volumes attach physical data on hard drive to your pod, it can be storage on local machine or remote which outside of the K8s cluster it could be cloud storage or own storage which not part of K8s cluster
K8s doesn’t manager data persistance, so admin or user need to make proper backup of data 

### 7. Deployment 
Blueprint for my-app pods
You create deployments instead of duplicate pod
Here we decide how many replica we need, also scale up and scale down number of pods we need
Abstraction of Pods 
Replicate everything
In case one pod down we have replicate node which have exact copy of node 
Node 1 : my-app and db
Node 2 : my-app 

We can not replicate db via Deployment because database has state which is data, so deployment for stateLESS Apps

for example which pod reading and which pod writing, so we need shared db, so we have K8s StatefulSet component 

### 8. StatefulSet
For Stateful apps like : mongodb, mysql, elastic search or any other stateful application 
Deploying StatefulSet not easy that is why Db are often hosted outside of K8s cluster

There are more K8s component but these are the main component mostly used. 

---

## K8s Architecture explained
### Node : Worker machine in K8s cluster like a AWS EC2 instance.
##### Each node has multiple Pods on it for example my-app pod and db pod
##### 3 processes must be installed on every Node like 
1. **container runtime** need to install on every node, 
2. **Kubelet** which schedule pods in container, Kubelet interacts with both container and node, Kubelet starts the pod with a container inside, assign resources from node to container  
3. **Kobe Proxy** which forwards the requests, it manage which request forward to where, for example my-app should first send db request to same node db pod instead of replica node

### Cluster :  it can have multiple Nods inside 

How do you interact with this cluster ?
How to : 
- schedule pod ?
- Monitor ?
- Re-schedule/re-start pod ?
- Join a new node ?

Answer is **Master Processes** or **Master server** or **Master node**

#### Master Processes
4 processes run on every master node
1. **Api server** which is used to interact with client (Ui, K8s dashboard, Cmd tool, K8s api), so Api server is like cluster gateway which get initial request of update/query in cluster, its acts as a gatekeeper for authentication 
2. **Scheduler** : for schedule new pod it work like api server > scheduler > start new pod in worker (node), it also check where to put the Pod, in least used pod it will create new pod, so Scheduler just decides on which Node new pod should be scheduled 
3. **Controller manager** : detects cluster state changes for example pods down in nodes so it will detect and try to recover cluster state as soon as possible, it will send request to scheduler which decide where to add new pods 
4. **etcd** : it key value store of cluster, etcd is the cluster brain. Every change in cluster get stored in the key value store, everything in cluster work with this etcd data, actual application data is not stored in etcd, it store cluster information like which node is least used etc. 
 

#### Master node need less resources like CPU | RAM | STORAGE 

##### Example Cluster Set-Up
2 Master Nodes
3 Worker Nodes    


### What is minikube ?
It is used to Test Cluster Setup or Local Cluster Setup
Master and node precesses run on One machine 
1. Creates virtual box on your laptop
2. Node runs in that virtual box
3. 1 node K8s cluster
4. For testing purposes 

### What is kubectl ?
Now as you have local node in your virtual machine using minikube, you need some way to interact with cluster for create pods and other K8s components, so we can do this using Kubectl. Kubectl is command line tool for K8s cluster 

As you know to interact with Api server in master processes we need client, so KubeCtl is CLI client 
Kubectl is not just for mnikube cluster, it can be use with Cloud cluster or Hybrid cluster, so it is for interact with any type of K8s cluster setup 


Lession 123