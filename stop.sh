#!/bin/bash

# Stop AI Study Assistant servers

echo "🛑 Stopping AI Study Assistant..."

# Read PIDs from file if it exists
if [ -f ".server_pids" ]; then
    PIDS=$(cat .server_pids)
    for PID in $PIDS; do
        if ps -p $PID > /dev/null 2>&1; then
            kill $PID 2>/dev/null
            echo "✅ Stopped process $PID"
        fi
    done
    rm .server_pids
fi

# Also kill any uvicorn or vite processes
pkill -f "uvicorn app.main:app" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo "✅ All servers stopped"

