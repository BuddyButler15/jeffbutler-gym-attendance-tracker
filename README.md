# Gym Attendance Tracker (GAT)

A crowd-sourced gym check-in app for University of Iowa students. See live headcounts at the three main rec facilities before making the trip.

Live at **[www.buddybutler.me](https://www.buddybutler.me)**

Built by Buddy Butler — Business Analytics & Information Systems, Class of 2027.

---

## What It Does

Students check in when they arrive at a gym and check out when they leave. The app displays real-time headcounts so anyone can see how busy each facility is before heading over. Counts update automatically every 30 seconds.

**Supported gyms:**
- CRWC (Campus Recreation and Wellness Center) — capacity 350
- Field House — capacity 150
- Fitness East — capacity 120

No account required. Each browser session is tracked anonymously with a session ID stored in localStorage.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend API | Node.js, Fastify |
| Database | PostgreSQL |
| Frontend Hosting | Azure Static Web Apps |
| API Hosting | Replit (Autoscale Deployment) |
| Analytics | Google Analytics (G-TE530WRE14) |
| Domain | Namecheap → www.buddybutler.me |
| CI/CD | GitHub Actions |

---

## Project Structure

```
/
├── artifacts/
│   ├── gat-web/          # React + Vite frontend
│   └── api-server/       # Fastify REST API
├── packages/
│   └── api-client-react/ # Shared API client (React hooks)
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # CI/CD pipeline
└── scripts/
    └── post-merge.sh
```

---

## How It Works

1. On page load the frontend fetches current gym headcounts from the API.
2. A unique session ID is generated per browser and stored in localStorage.
3. When a student checks in, the API records their session against that gym. If they check in at a second gym, they are automatically checked out of the first.
4. A 30-second polling interval keeps counts fresh for all visitors.
5. Check-outs expire automatically on the server side after a set idle period so counts don't stay inflated if someone forgets to check out.

---

## Deployment

**Frontend** is built by GitHub Actions on every push to `main` and deployed to Azure Static Web Apps. The build injects `VITE_API_URL` pointing to the live Replit API deployment.

**API** is deployed as an autoscale service on Replit at `https://butler-plan.replit.app` and connects to a PostgreSQL database.

**Custom domain** `www.buddybutler.me` points to Azure via a CNAME record in Namecheap. The root domain `buddybutler.me` redirects to `www`.

---

## Pages

| Route | Description |
|---|---|
| `/` | Main check-in dashboard |
| `/about` | About the app |
| `/profile` | About the creator |
| `/terms` | Terms of use & privacy policy |

---

## Local Development

```bash
# Install dependencies
pnpm install

# Start both the API and frontend dev servers
pnpm run dev
```

The frontend runs on `localhost:24971` and the API on `localhost:8080`.
