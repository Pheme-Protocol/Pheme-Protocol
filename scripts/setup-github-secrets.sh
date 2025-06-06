#!/bin/bash

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "Please login to GitHub CLI first using 'gh auth login'"
    exit 1
fi

# Get AWS role ARN
AWS_ROLE_ARN=$(aws iam get-role --role-name github-actions-role --query 'Role.Arn' --output text)

# Set GitHub secrets
echo "Setting up GitHub secrets..."

# AWS Role ARN
gh secret set AWS_ROLE_ARN --body "$AWS_ROLE_ARN"

# Database credentials
gh secret set DB_HOST --body "pheme-staging-db.cluster-123456789012.us-east-1.rds.amazonaws.com"
gh secret set DB_PORT --body "5432"
gh secret set DB_NAME --body "pheme_staging"
gh secret set DB_USER --body "pheme_admin"
gh secret set DB_PASSWORD --body "$(openssl rand -base64 32)"

# Redis credentials
gh secret set REDIS_HOST --body "pheme-staging-redis.123456789012.us-east-1.cache.amazonaws.com"
gh secret set REDIS_PORT --body "6379"
gh secret set REDIS_PASSWORD --body "$(openssl rand -base64 32)"

# JWT secret
gh secret set JWT_SECRET --body "$(openssl rand -base64 64)"

# Other secrets
gh secret set NODE_ENV --body "production"
gh secret set LOG_LEVEL --body "info"

echo "GitHub secrets have been set up successfully!" 