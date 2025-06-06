# Production-ready Dockerfile for contracts (Hardhat)
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile && yarn build
CMD ["yarn", "test"] 