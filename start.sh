#!/bin/bash

# AI Study Assistant - Easy Startup Script
# This script starts both the backend and frontend servers

echo "🧠 Starting AI Study Assistant..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the StudyAssistant directory"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Check if ports are already in use
if check_port 8000; then
    echo "${YELLOW}⚠️  Port 8000 is already in use. Backend might already be running.${NC}"
else
    echo "${BLUE}🚀 Starting backend server...${NC}"
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "${YELLOW}⚠️  Virtual environment not found. Creating one...${NC}"
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "${YELLOW}⚠️  .env file not found. Please create one with your OPENAI_API_KEY${NC}"
    fi
    
    # Install/update dependencies if needed
    echo "${BLUE}📦 Checking dependencies...${NC}"
    pip install -q -r requirements.txt
    
    # Start backend in background
    echo "${BLUE}🚀 Starting backend server...${NC}"
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait a bit for backend to start
    sleep 3
    
    # Check if backend actually started
    if check_port 8000; then
        echo "${GREEN}✅ Backend started successfully (PID: $BACKEND_PID)${NC}"
        echo "   Backend API: http://localhost:8000"
        echo "   API Docs: http://localhost:8000/docs"
    else
        echo "${YELLOW}⚠️  Backend may have failed to start. Check backend.log for errors:${NC}"
        echo "   tail -20 backend.log"
        echo "${YELLOW}   Common issue: Missing dependencies. Try: cd backend && source venv/bin/activate && pip install -r requirements.txt${NC}"
    fi
fi

# Check if frontend port is in use
if check_port 5173; then
    echo "${YELLOW}⚠️  Port 5173 is already in use. Frontend might already be running.${NC}"
else
    echo "${BLUE}🚀 Starting frontend server...${NC}"
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "${YELLOW}⚠️  Dependencies not found. Installing...${NC}"
        npm install
    fi
    
    # Start frontend in background
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo "   Frontend: http://localhost:5173"
    cd ..
    
    # Wait a bit for frontend to start
    sleep 3
fi

echo ""
echo "${GREEN}🎉 AI Study Assistant is running!${NC}"
echo ""
echo "📱 Open your browser to: ${BLUE}http://localhost:5173${NC}"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop the servers, run: ./stop.sh"
echo "   Or manually: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Save PIDs to file for easy stopping
echo "$BACKEND_PID $FRONTEND_PID" > .server_pids

# Open browser automatically (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    sleep 2
    open http://localhost:5173
fi

