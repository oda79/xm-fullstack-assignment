# XM Fullstack Assignment – Quotes Service

A full-stack TypeScript application for fetching stock quotes, validating user input, and emailing a summary report.

Built with:
- **Vite + React + TailwindCSS + Zod + React Hook Form**
- **Node.js + Express + TypeScript + Nodemailer**
- **Vitest + React Testing Library**
- **Docker + Docker Compose**

---

## Overview

This project consists of two main parts:

| Layer        | Path       | Description                                                  |
|--------------|------------|--------------------------------------------------------------|
| **Frontend** | `apps/web` | A Vite React app where users request quotes, select a symbol,|
|              |            | choose date range, and receive data & charts.                |
| **Backend**  | `apps/api` | An Express server that validates input, fetches stock quote  | 
|              |            | data (local mocks), and emails the results using Nodemailer. |

The backend exposes a simple REST API consumed by the frontend.

---

## Features

### Frontend
- Form validation powered by **Zod + React Hook Form**
- Symbol selector with **local mock data filtering**  
  (TODO: integrate real live search API)
- Responsive **data table** with sorting
- **Recharts** line chart for visualizing price trends
- Clean, responsive UI with **TailwindCSS**
- Comprehensive unit and integration tests with **Vitest**

### Backend
- `/api/v1/health` GET endpoint - Health check 
- `/api/v1/symbols` GET endpoint - Company Symbols 
- `/api/v1/quotes` POST endpoint - Company Symbols Quotes
- Schema validation shared between frontend and backend via `@xm-schema/shared`
- Fetches quote data from **local mock JSON files**
- Sends summary emails via **Nodemailer**
- Typed responses and unified error handling

---

## Monorepo Structure
.
├── apps/
│ ├── api/ # Express backend
│ └── web/ # React + Vite frontend
├── packages/
│ └── shared/ # Shared Zod schemas and types
├── docker-compose.yml
└── README.md

---

## Mock Data

All quote data is currently served from local JSON files in `apps/api/data/quotes/`.

This design allows the project to run fully offline while still returning realistic responses.

### Example structure
apps/
└── api/
└── data/
└── quotes/
├── AAPL.json
├── AAON.json
├── AAME.json
├── AAL.json
├── AAOI.json
├── AAIT.json
└── symbols.json

---

## Running with Docker

```bash
# Build and start both web & api
docker compose up --build
```

### Default URLs:
Frontend: http://localhost:5173
Backend: http://localhost:4000

---

## Environment Variables

`apps/api/.env.dev`

```
NODE_ENV=prod
PUBLIC_API_URL=http://localhost:4000
PORT=4000
QUOTES_DIR=/app/data/quotes
WEB_ORIGIN=http://localhost:5173
SYMBOLS_FILE_PATH=/app/data/symbols.json
SYMBOLS_CACHE_SECONDS=300
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
EMAIL_FROM=noreply@example.com
```

`apps/web/.env.dev`

```
VITE_API_URL=http://localhost:4000
```
 
 ---

## Development Setup

### Install dependencies
```
pnpm install
```

### Run backend
```
cd apps/api
pnpm dev
```

### Run frontend
```
cd apps/web
pnpm dev
```

---

## Testing

Run all tests (frontend + shared) using pnpm:

```bash
pnpm --filter ./apps/web test
```

---

## License

MIT © 2025 Dmitry