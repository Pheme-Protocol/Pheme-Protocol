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
COPY contracts/package.json ./contracts/
COPY subgraph/package.json ./subgraph/
COPY src/package.json ./src/
COPY web/package.json ./web/

# Install dependencies
RUN yarn install

# Stage 2: Web Builder
FROM base AS web-builder
WORKDIR /app

# Copy only package.json files and yarn files for dependency install
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY contracts/package.json ./contracts/
COPY subgraph/package.json ./subgraph/
COPY src/package.json ./src/
COPY web/package.json ./web/

# Install dependencies
RUN yarn install

# Now copy the rest of the web directory
COPY web ./web

# Build web
RUN cd web && yarn build

# Stage 4: Production
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 pheme

# Copy built artifacts
COPY --from=web-builder /app/web/dist ./web/dist
COPY --from=web-builder /app/web/package.json ./web/
COPY --from=web-builder /app/web/yarn.lock ./web/

# Copy necessary configuration files
COPY web/next.config.js ./web/

# Set permissions
RUN chown -R pheme:nodejs /app

USER pheme

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
WORKDIR /app/web
RUN yarn install --frozen-lockfile
CMD ["yarn", "start"] 