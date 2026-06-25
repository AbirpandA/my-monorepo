# ---------------------------------------------------------
# Stage 1: Prune workspace for the React Admin Dashboard
# ---------------------------------------------------------
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune admin-dashboard --docker

# ---------------------------------------------------------
# Stage 2: Install and Build React (Static HTML/JS/CSS)
# ---------------------------------------------------------
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN npm install

COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=admin-dashboard...

# ---------------------------------------------------------
# Stage 3: Production Runner (NGINX Web Server)
# ---------------------------------------------------------
FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*
# Assuming Vite build output. Change 'dist' to 'build' if using Create React App.
COPY --from=installer /app/apps/admin-dashboard/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]