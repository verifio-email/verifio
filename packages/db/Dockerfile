FROM oven/bun:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json bun.lock ./
COPY packages/db ./packages/db
COPY packages/tsconfig ./packages/tsconfig

# Install only the db package dependencies
RUN bun install --filter=@verifio/db

# Stage 2: Run migrations
FROM base AS runner
WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages

WORKDIR /app/packages/db

# Run migrations using drizzle-kit (yes | to auto-accept prompts)
CMD sh -c "yes | bun run db:push"
