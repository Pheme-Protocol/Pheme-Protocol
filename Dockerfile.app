# --------- Parameterized Multi-Stage Dockerfile ---------
# Usage examples:
#   docker build -f Dockerfile.app --build-arg SERVICE=web --build-arg PORT=3000 -t pheme-web .
#   docker build -f Dockerfile.app --build-arg SERVICE=src --build-arg PORT=3001 -t pheme-backend .
#   docker build -f Dockerfile.app --build-arg SERVICE=bots --build-arg PORT=3002 -t pheme-bots .

ARG SERVICE=web
ARG PORT=3000

# Stage 1: Base
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++ git
WORKDIR /app

# Enable Corepack and prepare Yarn
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# Stage 2: Dependencies
FROM base AS deps
WORKDIR /app

# Copy all package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY tsconfig.base.json ./
COPY contracts/package.json ./contracts/
COPY subgraph/package.json ./subgraph/
COPY src/package.json ./src/
COPY web/package.json ./web/

# Install dependencies
RUN yarn install

# Stage 3: Backend Build
FROM deps AS backend-builder
WORKDIR /app

# Copy source code and configuration
COPY src ./src
COPY tsconfig.base.json ./
COPY --from=deps /app/node_modules ./node_modules

# Generate Prisma client and build backend
RUN cd src && \
    yarn prisma generate && \
    yarn build

# Stage 4: Production
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 pheme

# Copy built artifacts
COPY --from=backend-builder /app/src/dist ./src/dist
COPY --from=backend-builder /app/src/package.json ./src/
COPY --from=backend-builder /app/src/prisma ./src/prisma

# Set permissions
RUN chown -R pheme:nodejs /app

USER pheme

# Expose port
EXPOSE 3001

# Set environment variables
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Start the application
WORKDIR /app/src
RUN yarn install --frozen-lockfile
CMD ["yarn", "start"] 