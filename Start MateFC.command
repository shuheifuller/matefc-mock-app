#!/bin/bash
# Double-click launcher for MateFC Mock App (Vite + React + TS).
# Starts the Vite dev server and opens the app in the default browser.

set -u

# Move to the folder this script lives in (handles spaces in path).
cd "$(dirname "$0")" || exit 1

# Make sure npm / node are on PATH when launched from Finder (GUI shells
# do not load ~/.zshrc). Source common init files and add typical locations.
[ -f "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1
[ -f "$HOME/.zprofile" ] && . "$HOME/.zprofile" >/dev/null 2>&1
[ -f "$HOME/.profile" ]  && . "$HOME/.profile"  >/dev/null 2>&1
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$HOME/.volta/bin:$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -1)/bin:$PATH"

echo "=============================================="
echo "  MateFC Mock App"
echo "  Folder: $(pwd)"
echo "=============================================="
echo ""

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found on PATH."
  echo "Install Node.js from https://nodejs.org or via Homebrew (brew install node),"
  echo "then double-click this launcher again."
  echo ""
  read -n 1 -s -r -p "Press any key to close..."
  exit 1
fi

echo "Using: $(command -v npm)  ($(npm -v))"
echo "       $(command -v node) ($(node -v))"
echo ""

# Install deps the first time.
if [ ! -d "node_modules" ]; then
  echo "node_modules not found — running 'npm install' (one-time setup)..."
  npm install || { echo "npm install failed."; read -n 1 -s -r -p "Press any key to close..."; exit 1; }
  echo ""
fi

URL="http://localhost:5173"
echo "Starting Vite dev server..."
echo "App will be available at: $URL"
echo "Press Ctrl+C in this window to stop the server."
echo ""

# Open the browser after a short delay so Vite has time to bind the port.
( sleep 2 ; open "$URL" >/dev/null 2>&1 ) &

npm run dev
