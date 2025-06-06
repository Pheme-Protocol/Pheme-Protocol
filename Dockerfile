# Use Node.js LTS version as base
FROM node:20-alpine AS base

# Install common dependencies
RUN apk add --no-cache libc6-compat python3 make g++ git

# Stage 1: Dependencies
FROM base AS deps
WORKDIR /app

# Copy all package files
COPY package.json ./
COPY yarn.lock ./
COPY contracts/package.json ./contracts/
COPY subgraph/package.json ./subgraph/
COPY src/package.json ./src/
COPY web/package.json ./web/

# Install root dependencies
RUN yarn install --frozen-lockfile

# Stage 2: Contracts Build
FROM deps AS contracts-builder
WORKDIR /app/contracts
COPY contracts/ .
RUN yarn install --frozen-lockfile
RUN yarn compile
# Create artifacts directory if it doesn't exist
RUN mkdir -p artifacts

# Stage 3: Subgraph Build
FROM contracts-builder AS subgraph-builder
WORKDIR /app/subgraph
COPY subgraph/ .
RUN yarn install --frozen-lockfile
RUN yarn codegen
RUN yarn build

# Stage 4: Backend Build
FROM subgraph-builder AS backend-builder
WORKDIR /app/src
COPY src/ .
RUN yarn install --frozen-lockfile
# Ensure the dist directory exists
RUN mkdir -p dist
RUN yarn build

# Stage 5: Frontend Build
FROM backend-builder AS frontend-builder
WORKDIR /app/web
COPY web/ .
RUN yarn install --frozen-lockfile
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# Stage 6: Production
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 pheme

# Copy built artifacts
COPY --from=contracts-builder /app/contracts/artifacts ./contracts/artifacts
COPY --from=contracts-builder /app/contracts/cache ./contracts/cache
COPY --from=subgraph-builder /app/subgraph/build ./subgraph/build
COPY --from=backend-builder /app/src/dist ./src/dist
COPY --from=frontend-builder /app/web/.next ./web/.next
COPY --from=frontend-builder /app/web/public ./web/public
COPY --from=frontend-builder /app/web/package.json ./web/
COPY --from=frontend-builder /app/web/yarn.lock ./web/

# Copy necessary configuration files
COPY contracts/hardhat.config.ts ./contracts/
COPY subgraph/subgraph.yaml ./subgraph/
COPY src/tsconfig.json ./src/
COPY web/next.config.js ./web/

# Set permissions
RUN chown -R pheme:nodejs /app

USER pheme

# Expose ports
EXPOSE 3000 4000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
WORKDIR /app/web
RUN yarn install --frozen-lockfile
CMD ["yarn", "start"] 