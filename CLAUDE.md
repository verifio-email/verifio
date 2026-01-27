# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Verifio** is an open-source email verification infrastructure built as a monorepo using Turbo and Bun. It provides both a hosted API service and a self-hostable solution for email verification.

## Tech Stack

- **Runtime**: Bun 1.3.0 (package manager and runtime)
- **Build System**: Turbo (monorepo orchestration)
- **Frontend**: Next.js 16 with React 19, TypeScript
- **Backend**: Elysia.js (Bun-based HTTP framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis
- **UI**: Custom components using Radix UI primitives and Tailwind CSS 4
- **Auth**: Better Auth
- **Testing**: Bun test runner
- **Linting/Formatting**: Biome (tab indentation, double quotes)

## Common Development Commands

### Starting Services

Start local infrastructure first (PostgreSQL, Redis, Caddy proxy):
```bash
bun run docker:up
```

Start all services:
```bash
bun run verifio:dev
```

Start only frontend apps (web, dashboard, docs, blog):
```bash
bun run frontend:dev
```

Start only backend services (auth, verify, api-key, logs, upload, credits):
```bash
bun run backend:dev
```

Start individual services:
```bash
# Frontend (ports 3000-3004)
bun run fe:web:dev        # Port 3000 - Main website
bun run fe:dashboard:dev  # Port 3001 - Admin dashboard
bun run fe:docs:dev       # Port 3002 - Documentation
bun run fe:blog:dev       # Port 3004 - Blog

# Backend (ports 8000-8006)
bun run be:auth:dev       # Port 8000 - Authentication service
bun run be:verify:dev     # Port 8001 - Email verification core
bun run be:api-key:dev    # Port 8002 - API key management
bun run be:logs:dev       # Port 8003 - Logging service
bun run be:upload:dev     # Port 8004 - File upload service
bun run be:credits:dev    # Port 8005 - Credit management
bun run be:tools:dev      # Port 8006 - Free tools service
```

Stop Docker services:
```bash
bun run docker:down
```

### Database Operations

```bash
bun run db:push     # Push schema changes to database (development)
bun run db:studio   # Open Drizzle Studio (database GUI)
bun run db:generate # Generate TypeScript types from schema
bun run db:migrate  # Run database migrations
bun run db:seed     # Seed database with initial data
```

### Code Quality

```bash
bun run check       # Run Biome linter and formatter (auto-fixes issues)
```

## Monorepo Architecture

This is a **Turbo monorepo** with workspace dependencies managed by Bun.

### Directory Structure

```
apps/
  frontend/
    web/          # Main marketing website (Next.js, port 3000)
    dashboard/    # Admin dashboard (Next.js, port 3001)
    docs/         # Documentation site (Next.js, port 3002)
    blog/         # Blog platform (Next.js, port 3004)
  backend/
    auth/         # Authentication service (Elysia, port 8000)
    verify/       # Email verification core (Elysia, port 8001)
    api-key/      # API key management (Elysia, port 8002)
    logs/         # Logging service (Elysia, port 8003)
    upload/       # File upload service (Elysia, port 8004)
    credits/      # Credit management (Elysia, port 8005)
    tools/        # Free tools service (Elysia, port 8006)

packages/
  db/             # Shared database schema and client (Drizzle ORM)
  ui/             # Shared UI components (Radix + Tailwind)
  auth/           # Authentication logic (Better Auth)
  email-verify/   # Email verification engine (core logic)
  logger/         # Logging utilities
  cache/          # Redis caching layer
  analytics/      # Analytics tracking
  email/          # Email sending utilities
  api/            # API client utilities
  tailwind/       # Shared Tailwind config
  tsconfig/       # Shared TypeScript config
```

### Workspace Dependencies

Packages reference each other using `workspace:*` in package.json and import via `@verifio/*`:

- Import database: `import { schema } from "@verifio/db/schema"`
- Import UI components: `import { Button } from "@verifio/ui/button"`
- Import auth client: `import { authClient } from "@verifio/auth/client"`
- Import auth server: `import { authServer } from "@verifio/auth/server"`
- Import email verify: `import { verifyEmail } from "@verifio/email-verify"`

The `packages/db` package is the **single source of truth** for the database schema. All backend services import from it.

## Backend Architecture

### Elysia.js Services

Backend services use **Elysia.js**, a high-performance TypeScript framework running on Bun. Each service:

1. Imports `dotenv/config` for environment variables
2. Sets up CORS with specific origins
3. Optionally integrates OpenAPI/Swagger documentation
4. Defines routes using `.use()` pattern
5. Listens on a specific port

Example from `apps/backend/verify/src/index.ts`:
```typescript
const verifyService = new Elysia({ prefix: "/api/verify" })
  .use(cors({ origin: [...], credentials: true }))
  .use(openapi({ documentation: {...} }))
  .use(landing)
  .use(singleVerifyRoute)    // POST /v1/email
  .use(authenticatedSingleRoute)  // POST /v1/verify
  .listen({ port: 8001 })
```

### Service Communication

- Frontend → Backend: HTTP calls (fetch, axios, or Eden for Elysia typed clients)
- Backend → Backend: Workspace dependencies (direct imports, not HTTP)
- All services → Database: Shared `@verifio/db` package with Drizzle ORM
- All services → Cache: Shared `@verifio/cache` package with Redis

### Environment Variables

Each service needs a `.env` file. Copy from `env.global` and adjust:

```bash
cp env.global apps/backend/verify/.env
```

Key variables per service (see `ENV_GUIDE.md` for full list):
- **PORT**: Service-specific port (see table above)
- **PG_URL**: PostgreSQL connection string
- **REDIS_HOST**, **REDIS_PORT**, **REDIS_PASSWORD**: Redis connection
- **BETTER_AUTH_SECRET**, **BETTER_AUTH_URL**: Auth configuration

For local development, use `localhost` and `http://`. For production/Docker, use service names and `https://`.

## Frontend Architecture

### Next.js Apps

Frontend apps use **Next.js 16 with React 19** and the **Pages Router** (not App Router). Key patterns:

- Import shared UI: `import { Button } from "@verifio/ui/button"`
- Auth integration: `import { authClient } from "@verifio/auth/client"`
- Styling: Tailwind CSS 4 with `@verifio/tailwind` package

### Component Sharing

The `packages/ui` package exports individual components via path exports in package.json:

```typescript
import { Button } from "@verifio/ui/button"
import { Modal } from "@verifio/ui/modal"
import { cn } from "@verifio/ui/cn"
```

This ensures optimal tree-shaking and avoids pulling in unused components.

## Email Verification Engine

The core verification logic lives in `packages/email-verify/`. It performs:

1. **Syntax validation**: RFC 5322 compliance
2. **DNS resolution**: Domain existence
3. **MX records**: Mail server configuration
4. **SMTP handshake**: Server acceptance (no email sent)
5. **Catch-all detection**: Accept-all domains
6. **Disposable detection**: Temporary email services
7. **Role account detection**: Generic addresses (info@, support@)

All verification results include **raw signals**, making the system transparent and auditable.

## Code Style

- **Indentation**: Tabs (enforced by Biome)
- **Quotes**: Double quotes
- **Import organization**: Automatic (Biome organizes imports on save)
- **TypeScript**: Strict mode enabled
- **Testing**: Use Bun test runner (test files should be `*.test.ts` or in `__tests__` directories)

## Key Architectural Decisions

1. **Microservices**: Each backend service is independently deployable
2. **Workspace dependencies**: Backend services import shared packages directly (not HTTP calls)
3. **Single database schema**: All services use `@verifio/db` for consistency
4. **Transparent verification**: All email verification results include raw signals
5. **Hybrid deployment**: Same verification engine for hosted API and self-hosted
