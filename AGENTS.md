# AGENTS.md — Project Context for AI Coding Agents

> This file contains project-specific information intended for AI coding assistants. It is written in English because the source code, identifiers, and technical comments are predominantly English. Some domain documentation (e.g. `doc/db-schema.md`) and seed data use French terminology related to the "Compteurs Connectés" (Connected Meters) domain.

---

## Project Overview

**Name:** `watt` (internal package name). Evolving into a multi-tenant SaaS application for organization management with a specialized domain around **connected utility meters** (electricity, water, heating, gas), consumption tracking, contract management, and invoicing.

**Tech Stack:**

- **Framework:** [SvelteKit](https://kit.svelte.dev/) v2 (full-stack, SSR by default)
- **Frontend:** [Svelte](https://svelte.dev/) v5 (runes syntax), [Tailwind CSS](https://tailwindcss.com/) v4, [DaisyUI](https://daisyui.com/)
- **Language:** TypeScript v5 (strict mode enabled)
- **Bundler:** Vite v7
- **Runtime:** Node.js / Bun (Dockerfile uses Bun;
- **Database:** PostgreSQL with **TimescaleDB** extension (for time-series consumption data), accessed via [Prisma](https://www.prisma.io/) ORM v7.8 with `@prisma/adapter-pg`
- **Validation:** [Zod](https://zod.dev/) v4
- **UI Helpers:** [Fuma](https://github.com/peufo/fuma) (form actions, pagination, query parsing)
- **Auth:** Custom session-based auth using `@oslojs/crypto` (SHA-256 tokens) and `@node-rs/argon2` (password hashing)
- **Markdown:** [Carta-MD](https://github.com/BearToCode/carta-md) for rich text editing
- **Icons:** `@lucide/svelte`, `@mdi/js`

---

## Project Structure

```
src/
├── routes/                 # SvelteKit file-based routing
│   ├── +layout.svelte      # Root layout (Toaster, DrawerOrg)
│   ├── +layout.server.ts   # Global auth guard + org selection redirect
│   ├── auth/               # Login / Register / Logout page
│   ├── home/               # Org selection dashboard (users without active org)
│   ├── root/               # Root/admin only routes (orgs management, users list)
│   ├── health/             # Health check endpoint (`GET /health`)
│   └── (org)/              # Organization-scoped routes (layout enforces membership)
│       ├── +layout.server.ts   # Loads current org, handles `?orgId=` switching
│       ├── +page.svelte        # Redirects to `/members`
│       ├── members/            # Member/Contact CRUD + detail pages
│       ├── logs/               # Activity log viewer
│       ├── lab/                # Development/playground page
│       └── api/                # Internal API routes
│
├── lib/
│   ├── server/             # Server-only code (guarded by SvelteKit)
│   │   ├── auth.ts         # Session token lifecycle (create, validate, invalidate)
│   │   ├── db/
│   │   │   ├── index.ts    # Extended PrismaClient (birthday formatting middleware)
│   │   │   └── requests.ts # Common DB queries (getUserBasic, getInvitations)
│   │   ├── logs/
│   │   │   ├── logger.ts   # Audit logging helper
│   │   │   └── getLogs.ts  # Log fetching logic
│   │   ├── permission.ts   # Role-based access control (user + member levels)
│   │   ├── schema.ts       # Zod shape utility type
│   │   └── useFormData.ts  # Helper to parse edit-form state from URL params
│   ├── logs/               # Log display components (LogMemberCreate, LogDiff, etc.)
│   ├── markdown/           # Carta-MD wrappers (Markdown, MarkdownEdit)
│   ├── selector/           # Contact selector with Fuse.js fuzzy search
│   ├── material/           # Reusable UI components (Cards, ToggleMode)
│   ├── types.ts            # Shared TypeScript types
│   ├── labels.ts           # Human-readable labels for enums/roles
│   ├── selectOptions.ts    # Options for form select inputs
│   ├── formOptions.ts      # Form configuration helpers
│   └── api.ts              # Client-side API helpers
│
├── app.html                # HTML shell
├── app.css                 # Global styles (Tailwind + DaisyUI + custom components)
├── app.d.ts                # Global ambient types (App.Locals, App.PageData, PrismaJson)
└── hooks.server.ts         # Server hook: session cookie validation

prisma/
├── schema.prisma           # Full DB schema (Auth + Org + Connected Meters + Billing)
├── seed.ts                 # Demo data seed (includes French test data)
├── prisma.config.ts        # Prisma configuration (schema, migrations, seed, datasource)
└── migrations/             # Prisma migration files

doc/
├── db-schema.md            # Mermaid ER diagram of the full database schema
├── specs.md                # Functional specifications (views, features, business rules)
└── ROADMAP.md              # Implementation roadmap with time estimates
```

---

## Database Schema (High-Level)

The Prisma schema covers four domains:

1. **Authentication** — `User`, `Session`
   - `User` has a 1:1 link to `Contact`. Roles: `root`, `admin`, `basic`.
   - `Session` stores a SHA-256 hashed token, user reference, optional `orgId`, and expiry.

2. **Organization & Membership** — `Org`, `Member`, `Contact`
   - `Contact` is the central identity (name, email, address, birthday, etc.).
   - `Member` links a `Contact` to an `Org` with a role (`admin`, `manager`, `client`).

3. **Audit** — `Log`
   - Immutable audit events (`org_create`, `member_update`, `invitation_accept`, etc.) with JSON `data`.

4. **Connected Meters & Billing** — `Site`, `Location`, `Meter`, `Consumption`, `Tariff`, `TariffTier`, `Contract`, `BillingPoint`, `Invoice`, `InvoiceLine`, `InvoicePayment`
   - Meters track consumption readings over time.
   - `Consumption` is stored as a **TimescaleDB hypertable** partitioned by `timestamp`, with a composite primary key `@@id([id, timestamp])`.
   - The `Consumption.data` column is a typed JSON field (`JsonConsumptionData`) to remain flexible across meter types (electricity, water, heating, gas).
   - Tariffs support flat-rate, tiered, and subscription-plus-usage models.
   - Contracts link clients to tariffs and sites.
   - Billing points bind a meter + location + contract + contact.
   - Invoices have lines and payment records.

See `doc/db-schema.md` for a complete Mermaid ER diagram (in French).
See `doc/specs.md` for functional specifications and `doc/ROADMAP.md` for the implementation plan.

---

## Build, Dev & Test Commands

| Command                  | Description                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `bun run dev`            | Start Vite dev server                                                                |
| `bun run build`          | Production build (`vite build`)                                                      |
| `bun run preview`        | Preview production build locally                                                     |
| `bun run start`          | Run production server (`node ./build/index.js`). Runs `prisma migrate deploy` first. |
| `bun run check`          | Type-check Svelte + TypeScript (`svelte-check`)                                      |
| `bun run lint`           | Run Prettier check + ESLint                                                          |
| `bun run format`         | Auto-format with Prettier                                                            |
| `bun run migrate`        | Run Prisma migrations in dev mode                                                    |
| `bun run migrate:deploy` | Deploy Prisma migrations (production)                                                |
| `bun run generate`       | Regenerate Prisma Client                                                             |
| `bun run seed`           | Run `prisma/seed.ts` (creates root user + demo data)                                 |
| `bun run studio`         | Open Prisma Studio                                                                   |
| `./dev-postrges.sh`      | Start a local **TimescaleDB** Docker container for development                       |

> **Note:** There is currently **no automated test suite** in the project. The `lint` script is the primary automated quality gate.

---

## Development Conventions

### Code Style

- **Formatter:** Prettier with `prettier-plugin-svelte`
- **Indent:** Tabs (not spaces)
- **Quotes:** Single quotes
- **Semicolons:** Disabled (`semi: false`)
- **Trailing commas:** None
- **Print width:** 100
- **ESLint:** Flat config (`eslint.config.js`) using `@eslint/js`, `typescript-eslint`, `eslint-plugin-svelte`, and `prettier` (conflict resolution).

### TypeScript

- `strict: true` is enabled.
- Path aliases: `$lib` maps to `src/lib/`. Other aliases are handled by SvelteKit.
- The `app.d.ts` file augments `App.Locals` (session) and `App.PageData` (org, member), plus `PrismaJson` for typed JSON fields.

### Svelte

- Uses **Svelte 5 runes syntax** (`$props`, `$state`, etc.).
- Components are `.svelte` files with `<script lang="ts">`.
- DaisyUI themes: `light` (default) and `forest` (dark mode preference).

### Backend Patterns

- **Form actions** are built with `formAction(schema, handler)` from `fuma/server`, passing a Zod schema.
- **Permissions** are checked via `$lib/server/permission.ts`:
  - `permission.user.basic(locals)` — any authenticated user.
  - `permission.user.admin(locals)` — `root` or `admin` global role.
  - `permission.member.basic(locals)` — user must be a member of the current org.
  - `permission.member.manager(locals)` / `.admin(locals)` — org-level role checks.
- **Form editing state** is passed via URL query params (e.g. `?form_member=123`). The `useFormData` helper resolves these to Prisma records or partial objects.
- **Audit logging** uses `useLogger(memberId)` to write structured `Log` entries.

### Database Access

- Always import `prisma` from `$lib/server/db`.
- The Prisma client is extended with middleware that auto-formats `birthday` → `birthdayAsString` (`DD.MM.YYYY`) on create/update operations.
- Use the `pg` adapter (`PrismaPg`) with a `DATABASE_URL` environment variable.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable       | Purpose                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://postgres:dev-password@localhost:5432/watt`)                                 |
| `ADMIN_USERS`  | Semicolon-separated list of emails that get elevated roles on first registration (e.g. `admin@example.com;root@example.com`) |

---

## Authentication & Authorization

1. **Registration:** New users create a `User` + linked `Contact`. If their email is in `ADMIN_USERS`, they may become `root` (first user) or `admin`.
2. **Login:** Password verified with Argon2. A random session token is generated, hashed with SHA-256, and stored in the `Session` table. The raw token is sent as an `auth-session` cookie.
3. **Session validation:** `hooks.server.ts` validates the cookie on every request, extending expiry if within 15 days of expiration.
4. **Org context:** When a user has multiple memberships, the active org is stored on the `Session` row. Switching orgs updates `session.orgId` and reloads the page.
5. **Unauthenticated users** are redirected to `/auth`. **Users without an org** are redirected to `/home`.

---

## Deployment

- **Container:** `Dockerfile` uses `oven/bun:latest`, installs deps, builds the app, and runs `bun start` on port `3000`.
- **Migrations:** The `prestart` script runs `prisma migrate deploy` before starting the Node server.
- **CI/CD:** `.github/workflows/deploy.yml` defines a GitHub Actions workflow to build and push a Docker image to `ghcr.io`. It is currently disabled (`on: []`).

---

## Security Considerations

- Passwords are hashed with **Argon2** (`@node-rs/argon2`).
- Session tokens are **18-byte random values**, base64url-encoded for the cookie, SHA-256 hashed for DB storage.
- Cookies are session-scoped (`path: '/'`) and inherit expiration from the session expiry (30 days, sliding renewal).
- **Input validation** is performed server-side with Zod schemas in every form action.
- **Authorization** is enforced in `+page.server.ts` load functions and form actions via `permission` helpers — never rely solely on UI hiding.
- The `health` endpoint is unauthenticated and returns `200 { success: true }`.
- Prisma queries use parameterized statements; do not concatenate raw SQL.

---

## TimescaleDB / Hypertable Notes

- The `Consumption` table is a TimescaleDB hypertable. The migration SQL includes:
  ```sql
  CREATE EXTENSION IF NOT EXISTS timescaledb;
  SELECT create_hypertable('consumption', 'timestamp', create_default_indexes => false);
  ```
- Because Prisma manages the `timestamp` index via `@@index([timestamp])`, `create_default_indexes => false` is used to prevent TimescaleDB from creating a duplicate index.
- If you modify `Consumption` in the future, always use `prisma migrate dev --create-only` and review the generated SQL for hypertable compatibility.

---

## Session History (2026-04-27)

This session established the **Connected Meters** domain on top of the existing auth/org foundation:

- **Analysed** the project requirements document (cahier des charges) for a connected utility-meter SaaS.
- **Created** `README.md` at project root.
- **Extended** `prisma/schema.prisma` with new models:
  - `Site`, `Location`, `Meter` (with `modbusUnitId` for Modbus protocol)
  - `Consumption` (TimescaleDB hypertable, JSON `data` column)
  - `Tariff`, `TariffTier`, `Contract`, `BillingPoint`
  - `Invoice`, `InvoiceLine`, `InvoicePayment`
- **Integrated TimescaleDB**: `@@id([id, timestamp])`, `@@map("consumption")`, `create_default_indexes => false`.
- **Updated** `dev-postrges.sh` to use `timescale/timescaledb:latest-pg17`.
- **Updated** `prisma.config.ts` with seed configuration.
- **Updated** `prisma/seed.ts` to use `PrismaPg` adapter and generate demo data with Faker.
- **Added** `JsonConsumptionData` type in `src/app.d.ts`.
- **Created** `doc/db-schema.md` — Mermaid ER diagram.
- **Created** `doc/specs.md` — functional specifications (Org + Client portal, Modbus ingestion, billing).
- **Created** `doc/ROADMAP.md` — phased roadmap with ~49-day MVP estimate.

---

## Quick Start for Agents

1. Ensure **TimescaleDB** is running (use `./dev-postrges.sh` or your own instance).
2. Copy `.env.example` → `.env` and set `DATABASE_URL`.
3. Install dependencies: `bun install`
4. Run migrations: `bun run migrate`
5. (Optional) Seed demo data: `bun run seed`
6. Start dev server: `bun run dev`
7. Before committing, run: `bun run check && bun run lint`
