$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Stop-Setup([string]$Message) {
    Write-Host "SETUP FAILED: $Message" -ForegroundColor Red
    exit 1
}

Write-Host 'SchemeSaathi setup — checking prerequisites.' -ForegroundColor Cyan
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { Stop-Setup 'Python 3.11+ is required. Install from https://www.python.org/downloads/ and re-open PowerShell.' }
$pythonVersion = & python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"
$versionParts = $pythonVersion.Split('.') | ForEach-Object { [int]$_ }
if ($versionParts[0] -lt 3 -or ($versionParts[0] -eq 3 -and $versionParts[1] -lt 11)) { Stop-Setup "Python 3.11+ is required; found $pythonVersion. See https://www.python.org/downloads/." }
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { Stop-Setup 'Node.js 22.12+ (including npm) is required. Install an LTS release from https://nodejs.org/ and re-open PowerShell. No system software was installed.' }
$nodeVersionText = (& node --version).Trim().TrimStart('v')
$nodeVersion = $nodeVersionText.Split('.') | ForEach-Object { [int]$_ }
if ($nodeVersion[0] -lt 22 -or ($nodeVersion[0] -eq 22 -and $nodeVersion[1] -lt 12)) { Stop-Setup "Node.js 22.12+ is required; found $nodeVersionText. Update from https://nodejs.org/." }
$npm = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npm) { Stop-Setup 'npm was not found. Reinstall Node.js LTS from https://nodejs.org/ with npm included.' }
$git = Get-Command git -ErrorAction SilentlyContinue
if ($git) { Write-Host "Git: $((& git --version).Trim())" } else { Write-Host 'Git is optional and was not found. https://git-scm.com/downloads' }
Write-Host "Python $pythonVersion and Node.js $nodeVersionText found."

if (-not (Test-Path '.venv')) {
    Write-Host 'Creating local Python virtual environment...'
    & python -m venv .venv
    if ($LASTEXITCODE -ne 0) { Stop-Setup 'Could not create .venv.' }
} else { Write-Host 'Keeping existing .venv.' }
$venvPython = Join-Path $root '.venv\Scripts\python.exe'
Write-Host 'Installing backend dependencies in .venv...'
& $venvPython -m pip install -r backend\requirements.txt
if ($LASTEXITCODE -ne 0) { Stop-Setup 'Python dependency installation failed.' }
Write-Host 'Installing frontend npm dependencies...'
& npm install
if ($LASTEXITCODE -ne 0) { Stop-Setup 'npm install failed.' }
if (-not (Test-Path '.env')) {
    Copy-Item '.env.example' '.env' -ErrorAction Stop
    Write-Host 'Created .env from .env.example.'
} else { Write-Host 'Keeping existing .env unchanged.' }
Write-Host 'Initializing the local SQLite database (existing rows are preserved)...'
Push-Location backend
try { & $venvPython -m app.init_db; if ($LASTEXITCODE -ne 0) { Stop-Setup 'Database initialization failed.' } }
finally { Pop-Location }
Write-Host 'Setup complete. Start the API and frontend in separate terminals; see README.md.' -ForegroundColor Green
