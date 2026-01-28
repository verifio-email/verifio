FROM oven/bun:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Install Python and build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy all package files
COPY package.json bun.lock* ./
COPY apps packages
# Install all workspace dependencies (retry on network errors)
# better-sqlite3 build may fail but we use PostgreSQL
RUN for i in 1 2 3; do bun install && break || sleep 5; done

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
# Use ARG for build-time variables that can be overridden
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build using tsdown directly or through bun
WORKDIR /app/apps/backend/api-key
RUN bun run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy standalone build
COPY --from=builder /app/apps/backend/api-key/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# Copy workspace packages that are used as external dependencies
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps ./apps

EXPOSE 8002

CMD ["bun", "run", "dist/index.js"]

