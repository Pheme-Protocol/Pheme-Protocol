# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY ../package.json ../yarn.lock ./
COPY ../web/package.json ./web/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY .. .

# Build the application
RUN yarn workspace @pheme-protocol/web build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/web/.next ./.next
COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/package.json ./
COPY --from=builder /app/web/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"] 