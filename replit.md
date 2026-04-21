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
- **Purpose**: Crowd-sourced student check-in app for University of Iowa rec facilities. Students self-check-in/out to provide live headcounts. Branding: "Buddy Butler".
- **Features**:
  - 3 gym cards: CRWC, Field House, Fitness East (no addresses)
  - Live check-in counts per gym (crowd-sourced from student check-ins)
  - Busyness level bar and label (Quiet / Moderate / Busy / Very Busy)
  - One-tap Check In / Check Out — no account required
  - Anonymous session ID stored in localStorage
  - Prevents double-check-in across gyms (409 response)
  - Check-ins auto-expire after 3 hours
  - Counts auto-refresh every 30 seconds
  - "by Buddy Butler" branding in header

### API Server (`artifacts/api-server`)
- **Type**: Express 5 API
- **Base path**: `/api`
- **Routes**:
  - `GET /api/gyms` — returns all 3 gyms with live check-in counts + busynessLevel
  - `POST /api/gyms/:id/checkin` — body `{sessionId}`, checks student in; 409 if already checked in elsewhere
  - `POST /api/gyms/:id/checkout` — body `{sessionId}`, checks student out; 404 if not checked in here
  - `GET /api/gyms/session/:sessionId` — returns `{sessionId, checkedInGymId}` (null if not checked in)
  - `GET /api/healthz` — health check

## Database Schema

### `gyms` table
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | Auto-increment |
| name | text | "CRWC", "Field House", "Fitness East" |
| capacity | integer | Max occupancy (350, 150, 120) |
| created_at | timestamptz | Auto set |

### `checkins` table
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | Auto-increment |
| gym_id | integer FK | References gyms.id |
| session_id | text | UUID from browser localStorage |
| checked_in_at | timestamptz | Auto set |
| checked_out_at | timestamptz | Null until checked out; expires after 3 hours |

## Static HTML Pages

Located in `html-pages/`:
- `landing.html` — Marketing landing page with hero, how-it-works, gym list, CTAs; links to the app
- `product.html` — Product overview page: problem, solution, user persona, features, success metrics, author block

Both pages use Iowa black/gold color scheme, plain HTML/CSS (no framework), WCAG 2.1 AA compliant.
