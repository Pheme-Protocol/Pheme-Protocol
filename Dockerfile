# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
COPY web/package.json web/yarn.lock ./web/
RUN yarn install --frozen-lockfile

# Copy all files for development
FROM node:20-alpine AS dev
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile

# Build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn workspace @pheme-protocol/web build

# Production image, copy only necessary files
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copy built app and node_modules from builder
COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./web/.next/static
COPY --from=builder /app/web/public ./web/public
COPY --from=builder /app/web/package.json ./web/package.json

EXPOSE 3000
CMD ["yarn", "workspace", "@pheme-protocol/web", "dev"] 