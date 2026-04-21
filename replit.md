# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Gym Attendance Tracker (`artifacts/gat-web`)
- **Type**: React + Vite web app
- **Preview path**: `/`
- **Purpose**: Pitch-ready prototype showing simulated real-time gym occupancy at University of Iowa rec facilities.
- **Features**:
  - Dashboard with 4 UI rec facility cards (CRWC, Field House, HTRC, UCC Fitness)
  - Live simulated occupancy counts auto-refreshing every 45 seconds
  - Busyness level badges (quiet / moderate / busy / very busy)
  - Click any gym to open a weekly trend chart (recharts bar chart by hour, day-selectable)
  - "About this data" section explaining the prototype context
  - Fully responsive / mobile-first

### API Server (`artifacts/api-server`)
- **Type**: Express 5 API
- **Base path**: `/api`
- **Routes**:
  - `GET /api/gyms` — returns all gyms with current simulated occupancy
  - `GET /api/gyms/:id/trends` — returns 7 × 24 hourly trend data for a gym
  - `GET /api/healthz` — health check

## Database Schema

- **gyms** — id, name, short_name, location, capacity, description, created_at
  - Seeded with 4 UI rec facilities

## Simulation Engine

`artifacts/api-server/src/lib/occupancy-simulator.ts` — computes realistic occupancy based on:
- Time of day (hour 0–23)
- Day of week (weekday vs weekend patterns)
- Small random ±8% variance so numbers feel live
- Peak hours: lunch (12–1pm) and after class/evening (4–8pm)
