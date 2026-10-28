# Docker Cheat Sheet

A practical Docker command reference for daily development, debugging, and production-oriented workflows. Since you already work with Node.js microservices and Kubernetes, this focuses on commands you'll actually use rather than Docker basics alone.

## 1. Images

| Command                                     | Purpose                           |
| ------------------------------------------- | --------------------------------- |
| `docker images`                             | List local images                 |
| `docker pull nginx:alpine`                  | Download an image                 |
| `docker build -t myapp:1.0 .`               | Build an image                    |
| `docker build -t myapp:1.0 -f Dockerfile .` | Build using a specific Dockerfile |
| `docker image inspect myapp:1.0`            | Inspect image metadata            |
| `docker image history myapp:1.0`            | View image layers                 |
| `docker tag myapp:1.0 myapp:latest`         | Add another tag                   |
| `docker rmi myapp:1.0`                      | Remove an image                   |
| `docker image prune`                        | Remove unused dangling images     |
| `docker image prune -a`                     | Remove all unused images          |

## 2. Containers

| Command                                 | Purpose                                 |
| --------------------------------------- | --------------------------------------- |
| `docker ps`                             | List running containers                 |
| `docker ps -a`                          | List all containers                     |
| `docker run nginx:alpine`               | Run a container                         |
| `docker run -d nginx:alpine`            | Run in the background                   |
| `docker run --name web nginx:alpine`    | Assign a container name                 |
| `docker run -d -p 8080:80 nginx:alpine` | Map host port 8080 to container port 80 |
| `docker run -it ubuntu bash`            | Start an interactive shell              |
| `docker stop web`                       | Stop a container                        |
| `docker start web`                      | Start a stopped container               |
| `docker restart web`                    | Restart a container                     |
| `docker rm web`                         | Remove a stopped container              |
| `docker rm -f web`                      | Force-remove a container                |
| `docker exec -it web sh`                | Open a shell inside a running container |
| `docker inspect web`                    | Inspect container configuration         |
| `docker stats`                          | View live CPU, memory, and I/O usage    |
| `docker top web`                        | View processes inside a container       |

Remember the port mapping:

```
docker run -d --name web -p 8080:80 nginx:alpine
```

- `8080` = port on your Mac.
- `80` = port inside the container.
- Open `http://localhost:8080`.

## 3. Logs and debugging

| Command                                     | Purpose                       |
| ------------------------------------------- | ----------------------------- |
| `docker logs web`                           | View logs                     |
| `docker logs -f web`                        | Follow logs continuously      |
| `docker logs --tail 100 web`                | Show the last 100 lines       |
| `docker logs --since 10m web`               | Show recent logs              |
| `docker inspect web`                        | Check configuration and state |
| `docker inspect -f '{{.State.Status}}' web` | Print container status        |
| `docker port web`                           | Show published ports          |
| `docker diff web`                           | Show filesystem changes       |
| `docker events`                             | Stream Docker events          |

Common debugging sequence:

```
docker ps -a
docker logs --tail 200 product-service
docker inspect product-service
docker stats
```

Use this when a container exits unexpectedly, repeatedly restarts, or becomes unhealthy.

## 4. Execute commands inside containers

```
# Open a shell
docker exec -it product-service sh

# Run a command without opening a shell
docker exec product-service node --version

# Run as root (if the image supports it)
docker exec -u 0 -it product-service sh

# Inspect environment variables
docker exec product-service printenv

# Copy a file from host to container
docker cp ./config.json product-service:/app/config.json

# Copy a file from container to host
docker cp product-service:/app/logs/app.log ./app.log
```

Note: minimal images such as Alpine often have `sh` but not `bash`. Distroless images may not include a shell at all.

## 5. Networks

| Command                                     | Purpose                 |
| ------------------------------------------- | ----------------------- |
| `docker network ls`                         | List networks           |
| `docker network create app-network`         | Create a network        |
| `docker network inspect app-network`        | Inspect network details |
| `docker network connect app-network web`    | Connect a container     |
| `docker network disconnect app-network web` | Disconnect a container  |
| `docker network rm app-network`             | Remove a network        |
| `docker network prune`                      | Remove unused networks  |

Example: connect a Node.js API and PostgreSQL to the same network.

```
docker network create app-network

docker run -d \
  --name postgres \
  --network app-network \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=shop_db \
  postgres:17

docker run -d \
  --name product-service \
  --network app-network \
  -e DATABASE_URL=postgresql://postgres:devpassword@postgres:5432/shop_db \
  my-product-service:1.0
```

Inside `product-service`, use `postgres` as the database hostname, not `localhost`.

This is a development example. Use secrets management and appropriately secured credentials for production.

## 6. Volumes and persistent data

| Command                        | Purpose               |
| ------------------------------ | --------------------- |
| `docker volume ls`             | List volumes          |
| `docker volume create pgdata`  | Create a volume       |
| `docker volume inspect pgdata` | Inspect a volume      |
| `docker volume rm pgdata`      | Remove a volume       |
| `docker volume prune`          | Remove unused volumes |

Run PostgreSQL with persistent storage:

```
docker volume create pgdata

docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=shop_db \
  -v pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:17
```

Two common mount types:

```
# Named volume: managed by Docker
-v pgdata:/var/lib/postgresql/data

# Bind mount: maps a host directory
-v "$PWD":/app
```

Important: removing a container doesn't normally remove its named volume. However, removing a volume destroys its stored data. Be especially careful with `docker compose down -v`.

## 7. Docker Compose

Useful for your multi-service applications.

| Command                                          | Purpose                                     |
| ------------------------------------------------ | ------------------------------------------- |
| `docker compose up`                              | Start services in the foreground            |
| `docker compose up -d`                           | Start in the background                     |
| `docker compose up --build -d`                   | Build and start services                    |
| `docker compose down`                            | Stop and remove project containers/networks |
| `docker compose down -v`                         | Also remove declared project volumes        |
| `docker compose ps`                              | List project containers                     |
| `docker compose logs -f`                         | Follow logs for all services                |
| `docker compose logs -f product-service`         | Follow one service's logs                   |
| `docker compose exec product-service sh`         | Open a shell in a running service           |
| `docker compose build`                           | Build service images                        |
| `docker compose pull`                            | Pull service images                         |
| `docker compose restart product-service`         | Restart one service                         |
| `docker compose config`                          | Validate and render Compose configuration   |
| `docker compose up -d --scale product-service=3` | Request three instances of a service        |

Example development workflow:

```
docker compose config
docker compose up --build -d
docker compose ps
docker compose logs -f product-service
docker compose down
```

Scaling note: `--scale` can conflict with a fixed `container_name` and doesn't automatically provide production-grade load balancing or orchestration. For production orchestration, use Kubernetes or an appropriate container platform.

## 8. Build optimization and Dockerfiles

| Command                                                   | Purpose                             |
| --------------------------------------------------------- | ----------------------------------- |
| `docker build -t app:1.0 .`                               | Build an image                      |
| `docker build --no-cache -t app:1.0 .`                    | Build without cached layers         |
| `docker build --pull -t app:1.0 .`                        | Check for a newer base image        |
| `docker build --target production -t app:1.0 .`           | Build a specific multi-stage target |
| `docker buildx build --platform linux/amd64 -t app:1.0 .` | Build for a target platform         |
| `docker history app:1.0`                                  | Inspect image layers                |
| `docker system df`                                        | Check Docker disk usage             |

Example production-oriented Node.js Dockerfile:

```
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000

CMD ["node", "dist/server.js"]
```

Adapt the build output and start command to your project. This assumes TypeScript compiles into `dist/` and runtime dependencies are declared correctly in `package.json`.

Add a `.dockerignore` file:

```
node_modules
dist
.git
.env
coverage
npm-debug.log*
```

If your build requires files such as generated assets or certificates, don't exclude them indiscriminately. Inject secrets at runtime rather than baking them into the image.

## 9. Registries: Docker Hub, ECR and Nexus

| Command                             | Purpose                        |
| ----------------------------------- | ------------------------------ |
| `docker login`                      | Log in to the default registry |
| `docker login registry.example.com` | Log in to a private registry   |
| `docker logout`                     | Log out                        |
| `docker tag app:1.0 user/app:1.0`   | Tag an image for publishing    |
| `docker push user/app:1.0`          | Push an image                  |
| `docker pull user/app:1.0`          | Pull an image                  |

> [!NOTE]
> Tag is like copy and rename image to a different name, for example we have a my-app:1.0 image on local, now we want to push it to AWS ECR so we need to first tag it with registory url like docker tag erc-registory-url/my-app:1:0
```
docker tag my-app:1:0 664574038682.dkr.ecr-eu-central-1.amazonaws.com/my-app:1:0
```


Typical CI/CD workflow:

```
# Build
docker build -t product-service:1.0.0 .

# Tag for registry
docker tag product-service:1.0.0 \
  your-dockerhub-username/product-service:1.0.0

# Authenticate
docker login

# Publish
docker push your-dockerhub-username/product-service:1.0.0
```

For AWS ECR, authenticate using AWS CLI:

```
aws ecr get-login-password --region us-east-1 |
  docker login \
    --username AWS \
    --password-stdin \
    123456789012.dkr.ecr.us-east-1.amazonaws.com
```

Replace the account ID and region with your actual ECR details.

## 10. Cleanup and disk space

| Command                  | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `docker system df`       | View disk usage                               |
| `docker container prune` | Remove stopped containers                     |
| `docker image prune`     | Remove dangling images                        |
| `docker network prune`   | Remove unused networks                        |
| `docker volume prune`    | Remove unused volumes                         |
| `docker system prune`    | Remove several categories of unused resources |
| `docker system prune -a` | Also remove all unused images                 |

Be careful: cleanup commands can remove resources you intended to keep. Inspect disk usage before running aggressive cleanup, and avoid pruning volumes unless you understand their contents.

## 11. Health checks and resource limits

```
# Set memory limit to 512 MB
docker run -d --name app \
  --memory=512m \
  myapp:1.0

# Set CPU limit to 1 CPU
docker run -d --name app \
  --cpus=1 \
  myapp:1.0

# Inspect health status
docker inspect --format='{{.State.Health.Status}}' app

# View resource usage
docker stats app
```

A Dockerfile health check can look like this:

```
HEALTHCHECK --interval=30s --timeout=3s \
  --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
```

This requires a Node.js version that supports `fetch` and an application health endpoint at `/health`. A health check reports container health; it does not automatically restart every unhealthy container.

## 12. Common problems and fixes

| Problem                                 | What to check                                                         |
| --------------------------------------- | --------------------------------------------------------------------- |
| Container exits immediately             | `docker logs CONTAINER` and `docker inspect CONTAINER`                |
| Port already in use                     | Change host port, e.g. `-p 8081:3000`                                 |
| Cannot connect to database              | Check network, hostname, port and credentials                         |
| Image build is slow                     | Check `.dockerignore`, layer order and build cache                    |
| Container runs out of memory            | `docker stats`, memory limits and application usage                   |
| Image architecture mismatch             | `docker image inspect IMAGE` and `docker buildx build --platform ...` |
| Container can't resolve another service | Put both on the same network and use the service/container DNS name   |
| Changes aren't reflected                | Rebuild the image or verify bind mounts                               |

## 13. Commands worth memorizing first

#### Containers
```
docker ps -a

docker logs -f CONTAINER

docker exec -it CONTAINER sh

docker inspect CONTAINER

docker stats
```
#### Images
```
docker build -t app:1.0 .

docker images

docker image history app:1.0

docker push IMAGE

docker pull IMAGE
```

#### Compose
```
docker compose up --build -d

docker compose ps

docker compose logs -f SERVICE

docker compose exec SERVICE sh

docker compose down
```

#### Networking and storage
```
docker network ls

docker network inspect NETWORK

docker volume ls

docker system df
```