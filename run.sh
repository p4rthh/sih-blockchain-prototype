#!/bin/bash
set -e

echo "========================================================="
echo "  CHAINWATCH // Forensic Intelligence Operations Engine  "
echo "========================================================="

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Start Backend
echo "[1/2] Launching Forensic Core API on :8000..."
cd "$ROOT_DIR/backend"
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r requirements.txt
fi

./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 2. Start Frontend
echo "[2/2] Launching Tactical Dashboard on :3000..."
cd "$ROOT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!

trap "echo 'Shutting down services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" SIGINT SIGTERM EXIT

echo ""
echo "CHAINWATCH is running!"
echo "-> Frontend: http://localhost:3000"
echo "-> Backend API: http://localhost:8000/docs"
echo "Press Ctrl+C to stop both servers."
wait
