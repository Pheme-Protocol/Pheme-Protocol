# -------- Stage 1: Dependencies --------
FROM node:20-alpine AS deps
WORKDIR /app

# Install required tools
RUN apk add --no-cache bash curl

# Install yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# -------- Stage 2: Build Application --------
FROM node:20-alpine AS builder
WORKDIR /app

# Install required tools
RUN apk add --no-cache bash curl

# Install yarn
RUN corepack enable && corepack prepare yarn@stable --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# -------- Stage 3: Runtime Image --------
FROM node:20-alpine AS runner
WORKDIR /app

# Runtime environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create unprivileged user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 pheme

# Copy necessary files from build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set ownership
RUN chown -R pheme:nodejs /app

USER pheme

EXPOSE 3000

CMD ["node", "dist/main.js"]