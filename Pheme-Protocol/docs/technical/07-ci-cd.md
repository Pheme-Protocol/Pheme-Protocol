# CI/CD Pipeline

## Overview

PHEME's CI/CD pipeline ensures reliable, automated deployment of all system components while maintaining high quality and security standards.

## Pipeline Architecture

```plaintext
[Code Push] → [CI Checks] → [Build] → [Test] → [Security Scan] → [Deploy] → [Monitor]
     ↑            |            |         |           |              |           |
     └────────────┴────────────┴─────────┴───────────┴──────────────┴───────────┘
                                   [Feedback Loop]
```

## GitHub Actions Workflow

### Main Pipeline

```yaml
name: PHEME CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  ci:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
          
      - name: Install Dependencies
        run: |
          npm ci
          
      - name: Lint
        run: |
          npm run lint
          npm run prettier:check
          
      - name: Test
        run: |
          npm run test
          npm run test:integration
          
      - name: Build
        run: npm run build
        
      - name: Security Scan
        uses: snyk/actions/node@master
        env:
          # ⚠️ Use GitHub Secrets for sensitive values
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
          
  deploy-staging:
    needs: ci
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          # ⚠️ Use GitHub Secrets for AWS credentials
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
          
      - name: Deploy
        run: |
          npm run deploy:staging
          
  deploy-production:
    needs: ci
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          # ⚠️ Use GitHub Secrets for AWS credentials
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
          
      - name: Deploy
        run: |
          npm run deploy:production
```

### Smart Contract Deployment

```yaml
name: Smart Contract Deployment

on:
  push:
    paths:
      - 'contracts/**'
    branches:
      - main

jobs:
  deploy-contracts:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Compile Contracts
        run: npx hardhat compile
        
      - name: Run Tests
        run: npx hardhat test
        
      - name: Deploy to Base Testnet
        if: github.ref == 'refs/heads/develop'
        run: |
          npx hardhat run scripts/deploy.ts --network base-testnet
        env:
          # ⚠️ Use GitHub Secrets for private keys
          PRIVATE_KEY: ${{ secrets.DEPLOY_PRIVATE_KEY }}
          
      - name: Deploy to Base Mainnet
        if: github.ref == 'refs/heads/main'
        run: |
          npx hardhat run scripts/deploy.ts --network base-mainnet
        env:
          # ⚠️ Use GitHub Secrets for private keys
          PRIVATE_KEY: ${{ secrets.DEPLOY_PRIVATE_KEY }}
```

## Deployment Configuration

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pheme-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pheme-api
  template:
    metadata:
      labels:
        app: pheme-api
    spec:
      containers:
      - name: pheme-api
        image: pheme/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              # ⚠️ Use Kubernetes Secrets for sensitive data
              name: pheme-secrets
              key: database-url
```

### Helm Chart

```yaml
# values.yaml
replicaCount: 3

image:
  repository: pheme/api
  tag: latest
  pullPolicy: Always

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
  hosts:
    - host: api.phemeai.xyz
      paths: ["/"]

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi
```

## Infrastructure as Code

### Terraform Configuration

```hcl
# AWS EKS Cluster
resource "aws_eks_cluster" "pheme" {
  name     = "pheme-cluster"
  role_arn = aws_iam_role.eks_cluster.arn

  vpc_config {
    subnet_ids = aws_subnet.private[*].id
  }
}

# RDS Database
resource "aws_db_instance" "pheme" {
  identifier        = "pheme-db"
  engine            = "postgres"
  engine_version    = "13.7"
  instance_class    = "db.t3.medium"
  allocated_storage = 20
  
  backup_retention_period = 7
  multi_az               = true
  
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.pheme.name
}

# Redis Cache
resource "aws_elasticache_cluster" "pheme" {
  cluster_id           = "pheme-cache"
  engine              = "redis"
  node_type           = "cache.t3.micro"
  num_cache_nodes     = 1
  parameter_group_name = "default.redis6.x"
}
```

## Monitoring & Alerts

### Prometheus Configuration

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'pheme-api'
    static_configs:
      - targets: ['pheme-api:3000']
  
  - job_name: 'pheme-frontend'
    static_configs:
      - targets: ['pheme-frontend:80']
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "PHEME System Metrics",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "http_request_duration_seconds"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      }
    ]
  }
}
```

## Deployment Strategies

### Blue-Green Deployment

```bash
#!/bin/bash

# Deploy new version
kubectl apply -f kubernetes/green-deployment.yaml

# Wait for new version to be ready
kubectl rollout status deployment/pheme-green

# Switch traffic to new version
kubectl patch service pheme-service -p '{"spec":{"selector":{"version":"green"}}}'

# Remove old version
kubectl delete deployment pheme-blue
```

### Canary Deployment

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: pheme-ingress
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "20"
spec:
  rules:
  - host: api.phemeai.xyz
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: pheme-canary
            port:
              number: 80
```

## Backup & Recovery

### Database Backup

```bash
#!/bin/bash

# Backup PostgreSQL database
pg_dump -h $DB_HOST -U $DB_USER -d pheme > backup.sql

# Upload to S3
aws s3 cp backup.sql s3://pheme-backups/$(date +%Y-%m-%d)/

# Cleanup
rm backup.sql
```

### Recovery Plan

1. **Service Disruption**
   * Switch to backup region
   * Restore from latest backup
   * Update DNS records
2. **Data Corruption**
   * Stop affected services
   * Restore from last known good backup
   * Verify data integrity
   * Resume services

## Security Measures

### Secret Management

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: pheme-secrets
type: Opaque
data:
  database-url: BASE64_ENCODED_URL
  api-key: BASE64_ENCODED_KEY
```

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-policy
spec:
  podSelector:
    matchLabels:
      app: pheme-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 3000
```

## Rollback Procedures

### Smart Contract Rollback

```typescript
// Proxy upgrade rollback
async function rollbackContract() {
  const proxyAdmin = await ethers.getContract("ProxyAdmin");
  const previousImpl = "0x..."; // Previous implementation address
  
  await proxyAdmin.upgrade(PROXY_ADDRESS, previousImpl);
}
```

### Application Rollback

```bash
#!/bin/bash

# Rollback to previous version
kubectl rollout undo deployment/pheme-api

# Verify rollback
kubectl rollout status deployment/pheme-api

# Monitor for issues
kubectl logs -l app=pheme-api --tail=100
```

## Documentation

### Release Notes Template

```markdown
# Release v1.0.0

## New Features
- Feature A: Description
- Feature B: Description

## Bug Fixes
- Fix 1: Description
- Fix 2: Description

## Breaking Changes
- Change 1: Migration steps
- Change 2: Required actions

## Deployment Instructions
1. Step 1
2. Step 2
3. Step 3
```

### Deployment Checklist

```markdown
## Pre-Deployment
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Documentation updated
- [ ] Database migrations ready

## Deployment
- [ ] Backup current state
- [ ] Deploy new version
- [ ] Run smoke tests
- [ ] Monitor metrics

## Post-Deployment
- [ ] Verify functionality
- [ ] Check error rates
- [ ] Update status page
- [ ] Notify stakeholders
```

## Security Best Practices

### Secrets Management

1. **GitHub Secrets**
   * Store all sensitive values in GitHub Secrets
   * Use environment-specific secrets
   * Regular rotation of credentials
   * Limit access to secret management
2.  **Kubernetes Secrets**

    ```yaml
    # ⚠️ Example structure only - never commit actual secrets
    apiVersion: v1
    kind: Secret
    metadata:
      name: pheme-secrets
    type: Opaque
    data:
      # Values should be base64 encoded
      database-url: <base64-encoded-url>
      api-key: <base64-encoded-key>
    ```
3. **AWS Secrets**
   * Use AWS Secrets Manager for production credentials
   * Implement proper IAM roles and policies
   * Enable audit logging for secret access
   * Regular rotation of access keys
4. **Contract Deployment**
   * Use different deployment keys for testnet/mainnet
   * Hardware wallet integration for production deployments
   * Multi-sig requirements for critical operations

### Access Control

1. **CI/CD Pipeline**
   * Restrict workflow permissions
   * Use environment protection rules
   * Implement approval processes for production deployments
2. **Infrastructure**
   * Network segmentation
   * Least privilege access
   * Regular security audits
   * Monitoring and alerting
