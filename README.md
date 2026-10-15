# SchemeSaathi

SchemeSaathi is a bilingual (English/Telugu) government-scheme information finder for India. It combines a small sample directory, filters, a transparent rule-based matching endpoint, and a rule-based bilingual help chat.

> **Important:** SchemeSaathi is an independent informational project, not a government service. Matches are preliminary suggestions—not eligibility decisions or benefit guarantees. The sample directory may be incomplete or out of date. Confirm current rules, deadlines, documents, and application steps with the linked official source. Never share Aadhaar numbers, bank details, passwords, or OTPs in this application.

## Prerequisites

- Python 3.11 or newer (Python 3.13 is supported)
- Node.js 22.12 LTS or newer, which includes npm
- Git is optional

The setup scripts check the prerequisites and point to official downloads if software is missing. They do not install system software or request administrator rights.

## Quick setup on Windows

1. Install Node.js LTS from [nodejs.org](https://nodejs.org/) if it is not already installed, then reopen PowerShell.
2. In the project root, run `powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1`.
3. Start the API in one PowerShell terminal: `..\.venv\Scripts\python.exe -m app` from the `backend` directory.
4. Start the frontend in another terminal from the project root: `npm run dev`.
5. Open the local URL printed by Vite (normally `http://127.0.0.1:5173`). API docs: `http://127.0.0.1:8000/docs`.

At initial inspection, Python 3.13.14 was available but Node.js/npm and Git were not detected. Install Node.js LTS before running setup if it is still missing. Setup scripts do not install system software or request administrator privileges.

## Quick setup on macOS/Linux

Run `bash scripts/setup.sh`, then start the API from `backend` with `../.venv/bin/python -m app` and the frontend from the project root with `npm run dev`.

## Run tests and production build

- Backend tests: from `backend`, run `..\.venv\Scripts\python.exe -m pytest` on Windows, or `../.venv/bin/python -m pytest` on macOS/Linux.
- Frontend tests: `npm test` from the project root.
- Frontend production build: `npm run build` from the project root.

## API endpoints

- `GET /api/health` — health check
- `GET /api/meta` — sample-directory size and verification status
- `GET /api/schemes?q=&category=&state=` — directory and filters
- `GET /api/schemes/{slug}` — scheme details
- `POST /api/eligibility/match` — preliminary profile matching with reasons and a relative score
- `POST /api/chat` — bilingual rule-based answers

The first API startup creates the SQLite database in `backend/schemesaathi.db` and seeds it only when the scheme table is empty. Existing records are preserved. Seed scheme links and rules are examples; the app intentionally records `last_verified` as empty rather than claiming source verification.

## Project layout

- `backend/app/` — FastAPI API, SQLAlchemy model, SQLite setup, seed records, matching and chat services
- `backend/tests/` — API tests
- `frontend/src/` — React pages, shared components, translations, API client and styles
- `scripts/` — safe platform setup scripts

## Local configuration

`.env.example` documents the frontend API URL. Setup copies it to `.env` only if `.env` does not exist. The frontend defaults to `http://127.0.0.1:8000`; set `VITE_API_URL` in `.env` only when the API is hosted elsewhere, then restart Vite.
