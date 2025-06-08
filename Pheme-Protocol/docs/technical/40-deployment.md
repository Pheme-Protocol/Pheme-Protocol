# Deployment Guide

This document outlines the deployment process for the PHEME Protocol platform.

## Overview

PHEME Protocol uses a containerized microservices architecture deployed on Kubernetes, with automated CI/CD pipelines for consistent and reliable deployments.

## Infrastructure

### Cloud Provider Setup

```hcl
# terraform/main.tf
provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source = "./modules/vpc"
  # VPC configuration
}

module "eks" {
  source = "./modules/eks"
  # EKS cluster configuration
}

module "rds" {
  source = "./modules/rds"
  # Database configuration
}
```

### Kubernetes Cluster

```yaml
# kubernetes/cluster-config.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: pheme-cluster
  region: us-east-1
nodeGroups:
  - name: ng-1
    instanceType: t3.large
    desiredCapacity: 3
    minSize: 2
    maxSize: 5
```

## Deployment Process

### 1. Build Phase

```yaml
# .github/workflows/build.yml
name: Build
on:
  push:
    branches: [main, develop]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker images
        run: |
          docker build -t pheme/api:$TAG ./services/api
          docker build -t pheme/frontend:$TAG ./apps/web
```

### 2. Test Phase

```yaml
# .github/workflows/test.yml
name: Test
jobs:
  test:
    steps:
      - name: Run tests
        run: |
          yarn test
          yarn test:e2e
          
      - name: Security scan
        run: |
          yarn audit
          docker scan pheme/api:$TAG
```

### 3. Deploy Phase

```yaml
# .github/workflows/deploy.yml
name: Deploy
jobs:
  deploy:
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f k8s/
          kubectl rollout status deployment/api
```

## Component Deployment

### API Service

```yaml
# kubernetes/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: pheme/api:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secrets
                  key: url
```

### Frontend Application

```yaml
# kubernetes/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  template:
    spec:
      containers:
        - name: frontend
          image: pheme/frontend:latest
          ports:
            - containerPort: 80
```

### Database Migration

```yaml
# kubernetes/migration-job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
spec:
  template:
    spec:
      containers:
        - name: migration
          image: pheme/api:latest
          command: ['yarn', 'migrate:deploy']
```

## Configuration Management

### Environment Variables

```yaml
# kubernetes/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: "production"
  API_URL: "https://api.pheme.protocol"
  REDIS_HOST: "redis-master"
```

### Secrets

```yaml
# kubernetes/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  JWT_SECRET: <base64-encoded>
  DATABASE_URL: <base64-encoded>
```

## Monitoring Setup

### Prometheus Configuration

```yaml
# monitoring/prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
```

### Grafana Dashboards

```yaml
# monitoring/grafana-dashboards.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
data:
  api-dashboard.json: |
    {
      "dashboard": {
        "title": "API Metrics"
        # Dashboard configuration
      }
    }
```

## Scaling Configuration

### Horizontal Pod Autoscaling

```yaml
# kubernetes/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 80
```

## Deployment Checklist

### Pre-deployment

* [ ] Run all tests
* [ ] Perform security scan
* [ ] Check resource requirements
* [ ] Update documentation
* [ ] Prepare rollback plan

### Deployment

* [ ] Apply database migrations
* [ ] Deploy API services
* [ ] Deploy frontend applications
* [ ] Update DNS records
* [ ] Configure monitoring

### Post-deployment

* [ ] Verify all services
* [ ] Check monitoring metrics
* [ ] Test critical paths
* [ ] Monitor error rates

## Rollback Procedures

### Quick Rollback

```bash
# Rollback deployment
kubectl rollout undo deployment/api

# Rollback database
yarn migrate:down

# Verify rollback
kubectl rollout status deployment/api
```

### Database Rollback

```typescript
// Database rollback procedure
async function rollbackMigration(version: string) {
  try {
    await prisma.migrate.reset();
    await prisma.migrate.up({
      to: version
    });
  } catch (error) {
    console.error('Migration rollback failed:', error);
    process.exit(1);
  }
}
```

## Troubleshooting

### Common Issues

1. Pod Startup Failures

```bash
# Check pod status
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>
```

2. Database Connection Issues

```bash
# Verify secrets
kubectl get secret db-secrets -o yaml

# Check connectivity
kubectl exec -it <pod-name> -- nc -zv <db-host> 5432
```

3. Resource Issues

```bash
# Check resource usage
kubectl top pods

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

## Security Considerations

### Network Policies

```yaml
# kubernetes/network-policies.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
```

### Pod Security

```yaml
# kubernetes/pod-security.yaml
apiVersion: v1
kind: Pod
metadata:
  name: api
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
  containers:
    - name: api
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
```

## Maintenance

### Regular Tasks

1. Certificate Rotation

```bash
# Update TLS certificates
kubectl create secret tls tls-secret \
  --cert=new-cert.pem \
  --key=new-key.pem \
  --dry-run=client -o yaml | kubectl apply -f -
```

2. Secret Rotation

```bash
# Update secrets
kubectl create secret generic app-secrets \
  --from-file=./secrets \
  --dry-run=client -o yaml | kubectl apply -f -
```

3. Resource Optimization

```bash
# Analyze resource usage
kubectl describe nodes | grep -A 5 "Resource usage"
```

## Backup Procedures

### Database Backup

```bash
# Automated backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > backup_$TIMESTAMP.sql
aws s3 cp backup_$TIMESTAMP.sql s3://backups/
```

### Configuration Backup

```bash
# Backup Kubernetes resources
kubectl get all -A -o yaml > cluster_backup_$(date +%Y%m%d).yaml
```
