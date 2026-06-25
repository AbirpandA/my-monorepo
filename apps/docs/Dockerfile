# ---------------------------------------------------------
# Stage 1: Prune workspace for the Docs app
# ---------------------------------------------------------
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune docs --docker

# ---------------------------------------------------------
# Stage 2: Install and Build
# ---------------------------------------------------------
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN npm install

COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=docs...

# ---------------------------------------------------------
# Stage 3: Production Runner
# ---------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/docs/public ./public
COPY --from=installer --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static

USER nextjs
EXPOSE 3002
ENV PORT=3002

CMD ["node", "apps/docs/server.js"]