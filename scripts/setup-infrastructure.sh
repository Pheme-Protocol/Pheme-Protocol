#!/bin/bash

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "Terraform is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Create S3 bucket for Terraform state
echo "Creating S3 bucket for Terraform state..."
aws s3api create-bucket \
    --bucket pheme-terraform-state \
    --region us-east-1 \
    --create-bucket-configuration LocationConstraint=us-east-1

# Enable versioning for the bucket
aws s3api put-bucket-versioning \
    --bucket pheme-terraform-state \
    --versioning-configuration Status=Enabled

# Initialize Terraform
echo "Initializing Terraform..."
cd infra
terraform init

# Plan the infrastructure
echo "Planning infrastructure..."
terraform plan -var-file=terraform.tfvars.staging

# Apply the infrastructure
echo "Applying infrastructure..."
terraform apply -var-file=terraform.tfvars.staging -auto-approve

# Get outputs
echo "Getting infrastructure outputs..."
CLUSTER_ENDPOINT=$(terraform output -raw cluster_endpoint)
DB_ENDPOINT=$(terraform output -raw db_endpoint)
DB_NAME=$(terraform output -raw db_name)
DB_USERNAME=$(terraform output -raw db_username)
DB_PASSWORD=$(terraform output -raw db_password)

# Update Kubernetes config
echo "Updating Kubernetes configuration..."
aws eks update-kubeconfig --name pheme-staging --region us-east-1

# Install cert-manager
echo "Installing cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Wait for cert-manager to be ready
echo "Waiting for cert-manager to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s

# Create namespace
echo "Creating namespace..."
kubectl create namespace pheme-staging

# Create secrets
echo "Creating Kubernetes secrets..."
kubectl create secret generic pheme-db-secret \
    --namespace pheme-staging \
    --from-literal=url="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_ENDPOINT}/${DB_NAME}"

# Output configuration
echo "Infrastructure setup complete!"
echo "Cluster Endpoint: ${CLUSTER_ENDPOINT}"
echo "Database Endpoint: ${DB_ENDPOINT}"
echo "Database Name: ${DB_NAME}"
echo "Database Username: ${DB_USERNAME}" 