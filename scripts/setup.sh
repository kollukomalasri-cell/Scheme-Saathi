#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
fail() { printf 'SETUP FAILED: %s\n' "$1" >&2; exit 1; }

command -v python3 >/dev/null 2>&1 || fail 'Python 3.11+ is required. Install from https://www.python.org/downloads/.'
PYTHON_VERSION="$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
python3 -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)' || fail "Python 3.11+ is required; found $PYTHON_VERSION. See https://www.python.org/downloads/."
command -v node >/dev/null 2>&1 || fail 'Node.js 22.12+ including npm is required. Install an LTS release from https://nodejs.org/. No system software was installed.'
NODE_VERSION="$(node --version | sed 's/^v//')"
node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 22 || (major === 22 && minor >= 12) ? 0 : 1)' || fail "Node.js 22.12+ is required; found $NODE_VERSION. Update from https://nodejs.org/."
command -v npm >/dev/null 2>&1 || fail 'npm was not found. Reinstall Node.js LTS from https://nodejs.org/ with npm included.'
if command -v git >/dev/null 2>&1; then git --version; else echo 'Git is optional; download from https://git-scm.com/downloads'; fi
printf 'Python %s and Node.js %s found.\n' "$PYTHON_VERSION" "$NODE_VERSION"

if [[ ! -d .venv ]]; then echo 'Creating local Python virtual environment...'; python3 -m venv .venv; else echo 'Keeping existing .venv.'; fi
.venv/bin/python -m pip install -r backend/requirements.txt || fail 'Python dependency installation failed.'
npm install || fail 'npm install failed.'
if [[ ! -f .env ]]; then cp .env.example .env; echo 'Created .env from .env.example.'; else echo 'Keeping existing .env unchanged.'; fi
( cd backend && ../.venv/bin/python -m app.init_db ) || fail 'Database initialization failed.'
echo 'Setup complete. Start the API and frontend in separate terminals; see README.md.'
