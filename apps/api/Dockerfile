# ---------------------------------------------------------
# Stage 1: Prune workspace to only the API and its dependencies
# ---------------------------------------------------------
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune api --docker

# ---------------------------------------------------------
# Stage 2: Install dependencies and build
# ---------------------------------------------------------
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN npm install

COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=api...

# ---------------------------------------------------------
# Stage 3: Production Runner
# ---------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /app/apps/api/dist ./dist
COPY --from=installer /app/apps/api/package.json .
RUN npm install --omit=dev

EXPOSE 8080
CMD ["node", "dist/index.js"]