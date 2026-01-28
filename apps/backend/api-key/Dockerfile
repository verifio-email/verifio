FROM oven/bun:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Install Python and build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Install only production dependencies first (to skip better-sqlite3 build)
# Copy all package files
COPY package.json bun.lock* ./
COPY apps packages
# Install all workspace dependencies needed for api-key
# Using --ignore-scripts to skip better-sqlite3 build (we use PostgreSQL, not SQLite)
RUN bun install --ignore-scripts

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
# Use ARG for build-time variables that can be overridden
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run --filter=api-key build

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

EXPOSE 8002

CMD ["bun", "run", "dist/index.js"]

