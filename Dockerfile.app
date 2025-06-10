# --------- Parameterized Multi-Stage Dockerfile ---------
# Usage examples:
#   docker build -f Dockerfile.app --build-arg SERVICE=web --build-arg PORT=3000 -t pheme-web .
#   docker build -f Dockerfile.app --build-arg SERVICE=src --build-arg PORT=3001 -t pheme-backend .
#   docker build -f Dockerfile.app --build-arg SERVICE=bots --build-arg PORT=3002 -t pheme-bots .

ARG SERVICE
ARG PORT=3000

FROM node:20-alpine AS base
WORKDIR /app

# Install required tools
RUN apk add --no-cache bash curl

# Install yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy root package files and service package files
COPY package.json yarn.lock .
COPY ${SERVICE}/package.json ./${SERVICE}/package.json

# Install dependencies (workspace-aware)
RUN yarn install --frozen-lockfile

# Copy only the relevant service source
COPY ${SERVICE}/ ./${SERVICE}/

# --------- Build Stage ---------
FROM base AS builder
WORKDIR /app/${SERVICE}

# Build the service (if applicable)
RUN if [ -f tsconfig.json ]; then yarn build; fi

# --------- Production Stage ---------
FROM node:20-alpine AS runner
WORKDIR /app

ARG SERVICE
ARG PORT=3000
ENV NODE_ENV=production
ENV PORT=${PORT}
ENV HOSTNAME="0.0.0.0"

# Create unprivileged user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 pheme

# Copy built app and node_modules
COPY --from=builder /app/${SERVICE}/dist ./${SERVICE}/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/${SERVICE}/package.json ./${SERVICE}/package.json

# For Next.js (web), also copy .next and public if present
COPY --from=builder /app/web/.next ./web/.next
COPY --from=builder /app/web/public ./web/public

# Set ownership
RUN chown -R pheme:nodejs /app
USER pheme

EXPOSE ${PORT}

# Entrypoint logic per service
CMD if [ "$SERVICE" = "web" ]; then cd web && yarn start; \
    elif [ "$SERVICE" = "src" ]; then cd src && node dist/main.js; \
    elif [ "$SERVICE" = "bots" ]; then cd bots && node dist/main.js; \
    else echo "Unknown service: $SERVICE" && exit 1; fi 