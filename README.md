# Calorie Tracker (MERN Prototype)

This repository contains a MERN-stack (MongoDB, Express, React, Node) prototype for a Calorie Tracker & Macro Dashboard.

Overview
- Backend: Node.js + Express + Mongoose (located in `backend/`).
- Frontend: React (Vite) (located in `frontend/`).
- Dev DB: by default the backend falls back to an in-memory MongoDB (`mongodb-memory-server`) when no `MONGO_URI` is provided. This makes it easy to run without installing Mongo.

Quick start (development)

1) Install dependencies

```powershell
cd "C:\Users\zinal\OneDrive\Documents\Coding\Calorie Tracker\backend"
npm install

cd "C:\Users\zinal\OneDrive\Documents\Coding\Calorie Tracker\frontend"
npm install
```

2) Seed demo data (creates demo user + sample foods)

```powershell
cd backend
npm run seed
```

3) Start backend and frontend (in separate terminals)

Backend (Express):
```powershell
cd backend
npm run dev
# Server listens at http://localhost:5000
```

Frontend (Vite):
```powershell
cd frontend
npm run dev
# Open the Vite URL (usually http://localhost:5173)
```

Demo credentials
- Email: `demo@example.com`
- Password: `password`

Environment variables
- Create `backend/.env` (or set environment variables) with:

```
MONGO_URI=mongodb://localhost:27017/calorie-tracker   # optional; if not set, app uses in-memory MongoDB for dev
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

Using Docker (optional)
- If you prefer a persistent Mongo via Docker, install Docker Desktop and run from project root:

```powershell
docker compose up -d
```

Then set `MONGO_URI` in `backend/.env` to your Docker Mongo (e.g. `mongodb://localhost:27017/calorie-tracker`) and restart the backend.

API (dev) overview
- `POST /api/auth/register` — register user ({ name, email, password }).
- `POST /api/auth/login` — login ({ email, password }) → returns JWT.
- `GET /api/profile` — get user profile (auth required).
- `PUT /api/profile` — update goal/baseline (auth required).
- `GET /api/foods` — list seeded food catalog.
- `POST /api/meals` — add meal (body: `{ foodId?, name?, per100?, grams }`). If `foodId` provided, backend scales nutrients from that food's `per100`. If `per100` provided, backend scales using the provided values.
- `GET /api/meals` — list today's meals.
- `DELETE /api/meals/:id` — delete a meal.
- `GET /api/stats` — daily totals (calories, protein, carbs, fats).

Frontend notes
- The Logging Panel supports choosing from a small built-in food catalog or typing a custom name.
- The frontend uses fuzzy matching (Fuse.js) to auto-match typed names to catalog entries — if a confident match is found it will use that food's nutrition. If ambiguous, you'll be prompted to confirm or enter per-100g macros.
- The top dashboard displays a calorie progress bar and a macro breakdown (protein/carbs/fats). The progress and macros update in real time after add/delete actions.

Persistence
- The development in-memory MongoDB is ephemeral: data will be lost when the backend process stops. For persistent data, use a real Mongo instance and set `MONGO_URI` accordingly.

Troubleshooting
- If you see `connect ECONNREFUSED` on seed or server startup, either start Mongo (Docker or local) or rely on the in-memory fallback (no action required).
- If the frontend shows an import error for `fuse.js`, run `npm install` in `frontend` and restart the Vite dev server.
- If login returns validation errors, check the network response in DevTools — the server returns an `errors` array with field messages.

Testing
- Manual test checklist is in the project notes: login/register, add meal, delete meal, toggle fitness goal, verify dashboard updates.
- Automated tests are not yet added; I can add Jest + supertest API tests on request.

Next steps (suggestions)
- Replace browser `prompt()` flows with a small modal form for entering per-100g macros.
- Persist custom foods to the catalog for reuse.
- Add automated tests for key API flows.

If you want, I can implement any of the suggested next steps — tell me which one to prioritize.
