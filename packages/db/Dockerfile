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

# DB_ACTION can be 'migrate' (default) or 'drop'
# Use: docker run -e DB_ACTION=drop ... to drop all tables
# Use: docker run -e DB_ACTION=migrate ... to run migrations (default)
ENV DB_ACTION=migrate

CMD sh -c "if [ \"$DB_ACTION\" = 'drop' ]; then bun run db:drop && bun run db:migrate; else bun run db:migrate; fi"
