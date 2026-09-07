# MERN + AWS Deployment GitHub Actions Cheat Sheet

## Typical MERN Deployment Flow

```text id="c3md2q"
GitHub Push
   ↓
GitHub Actions CI/CD
   ↓
Run Tests
   ↓
Build Frontend
   ↓
Build Backend
   ↓
Dockerize (optional)
   ↓
Deploy to AWS
   ├── EC2
   ├── ECS
   ├── Elastic Beanstalk
   ├── S3 + CloudFront
   └── Lambda
```

---

# Recommended Project Structure

```text id="jyzz2n"
project/
├── client/        # React frontend
├── server/        # Node/Express backend
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docker-compose.yml
└── Dockerfile
```

---

# MERN CI Pipeline

## `.github/workflows/ci.yml`

```yaml id="lyxmt6"
name: MERN CI

on:
  push:
    branches: [main, dev]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      # Frontend
      - name: Install Frontend
        run: |
          cd client
          npm ci

      - name: Build Frontend
        run: |
          cd client
          npm run build

      # Backend
      - name: Install Backend
        run: |
          cd server
          npm ci

      - name: Run Backend Tests
        run: |
          cd server
          npm test
```

---

# AWS Credentials Setup

## Add GitHub Secrets

Repository → Settings → Secrets → Actions

```text id="m7i4dg"
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
EC2_HOST
EC2_USER
EC2_SSH_KEY
```

---

# Deploy MERN App to EC2

## Install via SSH

```yaml id="9rrm7h"
name: Deploy EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /var/www/mern-app
            git pull origin main
            npm install
            cd client && npm install && npm run build
            cd ../server && npm install
            pm2 restart all
```

---

# Deploy React Frontend to S3 + CloudFront

## Build + Upload

```yaml id="nxgjjh"
name: Deploy Frontend

on:
  push:
    branches:
      - main

jobs:
  deploy-s3:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install
        run: |
          cd client
          npm ci

      - name: Build
        run: |
          cd client
          npm run build

      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Upload to S3
        run: |
          aws s3 sync client/build s3://your-bucket-name --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id YOUR_DIST_ID \
            --paths "/*"
```

---

# Deploy Backend with Docker to EC2

## Dockerfile

```dockerfile id="j4x7ak"
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

---

## GitHub Action

```yaml id="3m8v7p"
name: Docker Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Build Docker Image
        run: docker build -t mern-backend ./server

      - name: Save Image
        run: docker save mern-backend > backend.tar

      - name: Copy to EC2
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          source: backend.tar
          target: /home/ubuntu/

      - name: Deploy Container
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            docker load < backend.tar
            docker stop mern-backend || true
            docker rm mern-backend || true

            docker run -d \
              --name mern-backend \
              -p 5000:5000 \
              mern-backend
```

---

# PM2 Commands for Node Backend

```bash id="55o3q7"
pm2 start server.js
pm2 restart all
pm2 logs
pm2 status
pm2 save
```

---

# MongoDB Environment Variables

## GitHub Secrets

```text id="tnj2vz"
MONGO_URI
JWT_SECRET
REDIS_URL
```

## Use in Workflow

```yaml id="tz5c2f"
env:
  MONGO_URI: ${{ secrets.MONGO_URI }}
```

---

# AWS CLI Useful Commands

## S3

```bash id="r9dhqs"
aws s3 ls
aws s3 sync build/ s3://bucket-name
```

## EC2

```bash id="0k0wmb"
aws ec2 describe-instances
```

## CloudFront

```bash id="fy5q3r"
aws cloudfront create-invalidation \
--distribution-id ABC123 \
--paths "/*"
```

---

# Production Node Setup on EC2

## Install Node

```bash id="6x9v1n"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## Install PM2

```bash id="gj3fem"
sudo npm install -g pm2
```

---

# NGINX Reverse Proxy

## `/etc/nginx/sites-available/default`

```nginx id="4hh6to"
server {
    listen 80;

    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;

        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        proxy_set_header Host $host;

        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart:

```bash id="8u2yn6"
sudo systemctl restart nginx
```

---

# SSL with Certbot

```bash id="4n0nkh"
sudo apt install certbot python3-certbot-nginx

sudo certbot --nginx
```

---

# Common Deployment Architecture

## Beginner

```text id="1huzlv"
React → S3 + CloudFront
Node API → EC2
MongoDB → MongoDB Atlas
```

## Intermediate

```text id="7x9tr7"
Frontend → S3 + CloudFront
Backend → ECS/Docker
Database → Atlas/RDS
Redis → ElastiCache
```

## Advanced

```text id="v2b5ln"
Frontend → Amplify
Backend → EKS
Auth → Cognito
DB → DynamoDB/RDS
Monitoring → CloudWatch
```

---

# Useful GitHub Actions for MERN

| Action                                  | Purpose       |
| --------------------------------------- | ------------- |
| `actions/checkout`                      | Clone repo    |
| `actions/setup-node`                    | Setup Node    |
| `aws-actions/configure-aws-credentials` | AWS auth      |
| `appleboy/ssh-action`                   | SSH into EC2  |
| `appleboy/scp-action`                   | Copy files    |
| `docker/build-push-action`              | Docker builds |

---

# Branch Strategy

```text id="5uh2w4"
main     → production
develop  → staging
feature/* → new features
```

---

# Typical `.env`

## Backend

```env id="thk5lm"
PORT=5000
MONGO_URI=
JWT_SECRET=
NODE_ENV=production
```

## Frontend

```env id="86zy7h"
REACT_APP_API_URL=https://api.example.com
```

---

# Security Best Practices

- Never commit `.env`
- Use GitHub Secrets
- Restrict EC2 Security Groups
- Use IAM roles
- Enable HTTPS
- Use Docker in production
- Add health checks

---

# Useful Official Docs

- [GitHub Actions Docs](https://docs.github.com/actions?utm_source=chatgpt.com)
- [AWS CLI Docs](https://docs.aws.amazon.com/cli?utm_source=chatgpt.com)
- [PM2 Docs](https://pm2.keymetrics.io?utm_source=chatgpt.com)
- [NGINX Docs](https://nginx.org/en/docs/?utm_source=chatgpt.com)
- [Docker Docs](https://docs.docker.com?utm_source=chatgpt.com)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3?utm_source=chatgpt.com)
