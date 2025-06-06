# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY ../package.json ../yarn.lock ./
COPY ../contracts/package.json ./contracts/
COPY ../src/package.json ./src/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY .. .

# Build the application
RUN yarn workspace @pheme-protocol/backend build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/src/dist ./dist
COPY --from=builder /app/src/node_modules ./node_modules
COPY --from=builder /app/src/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"] 