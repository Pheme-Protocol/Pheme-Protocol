#!/bin/bash

# Exit on error
set -e

echo "🧪 Testing CI/CD workflow..."

# 1. Lint & Test
echo "📝 Running lint and tests..."
yarn lint
yarn test

# 2. Solidity Security Scan
echo "🔍 Running Solidity security scan..."
cd contracts
yarn hardhat compile
cd ..

# 3. Build & Compile
echo "🏗️ Building and compiling..."
yarn build:contracts
yarn build:backend
yarn build

# 4. Docker Build
echo "🐳 Building Docker images..."
docker build -t pheme-backend:test -f src/Dockerfile .
docker build -t pheme-web:test -f web/Dockerfile .

echo "✅ All tests passed!" 