# --------- Parameterized Multi-Stage Dockerfile ---------
# Usage examples:
#   docker build -f Dockerfile.app --build-arg SERVICE=web --build-arg PORT=3000 -t pheme-web .
#   docker build -f Dockerfile.app --build-arg SERVICE=src --build-arg PORT=3001 -t pheme-backend .
#   docker build -f Dockerfile.app --build-arg SERVICE=bots --build-arg PORT=3002 -t pheme-bots .

ARG SERVICE=web
ARG PORT=3000

# Base stage for dependencies
FROM node:20-alpine AS base
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache bash curl

# Enable Corepack and prepare Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies with caching
RUN --mount=type=cache,target=/app/.yarn/cache \
    yarn install

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy source code
COPY . .

# Build the web service
RUN cd web && \
    yarn install && \
    yarn build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Enable Corepack and prepare Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy package files and workspace configuration
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/.yarn ./.yarn

# Copy web service files
COPY --from=builder /app/web ./web

# Copy Next.js standalone output
RUN if [ -d "/app/web/.next/standalone" ]; then \
    cp -r /app/web/.next/standalone/* ./; \
fi

# Copy Next.js static files
RUN if [ -d "/app/web/.next/static" ]; then \
    mkdir -p .next/static && \
    cp -r /app/web/.next/static/* .next/static/; \
fi

# Copy public directory
RUN if [ -d "/app/web/public" ]; then \
    cp -r /app/web/public ./public; \
else \
    mkdir -p public; \
fi

# Copy next.config.js
RUN if [ -f "/app/web/next.config.js" ]; then \
    cp /app/web/next.config.js ./next.config.js; \
fi

# Install production dependencies
RUN yarn install --production

# Set proper permissions
RUN chown -R nextjs:nodejs /app

# Set environment variables
ENV PORT=${PORT}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Switch to non-root user
USER nextjs

# Change working directory to the web app
WORKDIR /app/web

# Expose the port
EXPOSE ${PORT}

# Start the application using the standalone server
CMD ["node", ".next/standalone/server.js"] 