#!/bin/bash
set -e
cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r requirements.txt
fi

echo "Starting CHAINWATCH Forensics Core on http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
