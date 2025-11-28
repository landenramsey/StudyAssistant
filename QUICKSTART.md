# 🚀 Quick Start Guide

## ⚡ Fastest Way to Start (Recommended)

### One-Command Startup

Simply run:

```bash
./start.sh
```

That's it! The script will:
- ✅ Check and start the backend server
- ✅ Check and start the frontend server
- ✅ Open your browser automatically
- ✅ Show connection status

**To stop everything:**
```bash
./stop.sh
```

---

## 📋 Manual Setup (If Needed)

### Prerequisites

- **Python 3.8+** (check with `python3 --version`)
- **Node.js 16+** (check with `node --version`)
- **OpenAI API Key** (get one at https://platform.openai.com/api-keys)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Create .env file with your API key
echo "OPENAI_API_KEY=your_api_key_here" > .env
# Or edit .env manually and add: OPENAI_API_KEY=sk-...

# Start the backend server
uvicorn app.main:app --reload
```

**Backend will run on:** http://localhost:8000

### Step 2: Frontend Setup (New Terminal)

Open a **new terminal window** and run:

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start the frontend server
npm run dev
```

**Frontend will run on:** http://localhost:5173

---

## 🎯 Quick Reference

| What | URL |
|------|-----|
| **Frontend App** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |

---

## 🔧 Troubleshooting

### Backend won't start?

1. **Check if port 8000 is in use:**
   ```bash
   lsof -i :8000
   ```
   If something is running, stop it or use a different port.

2. **Check your .env file:**
   ```bash
   cat backend/.env
   ```
   Make sure `OPENAI_API_KEY` is set correctly.

3. **Check backend logs for errors:**
   ```bash
   tail -20 backend.log
   ```
   Common issues:
   - Missing dependencies (run `pip install -r requirements.txt`)
   - Database initialization errors
   - Import errors

4. **Reinstall dependencies:**
   ```bash
   cd backend
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Verify database is initialized:**
   ```bash
   cd backend
   source venv/bin/activate
   python3 -c "from app.database import engine, Base, User; Base.metadata.create_all(bind=engine); print('✅ Database OK')"
   ```

### Frontend won't start?

1. **Check if Node.js is installed:**
   ```bash
   node --version
   ```
   If not, install it: `brew install node` (Mac) or download from nodejs.org

2. **Reinstall dependencies:**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   ```

### Can't upload files or ask questions?

- **Check connection status** - Look for the indicator in the top-right corner of the app
- **Red indicator** = Backend is offline. Make sure the backend server is running.
- **Green indicator** = Backend is connected and ready.

### "Cannot connect to server" error?

1. **Make sure the backend is running:**
   ```bash
   lsof -i :8000
   ```
   If nothing shows, start the backend:
   ```bash
   ./start.sh
   # Or manually:
   cd backend && source venv/bin/activate && uvicorn app.main:app --reload
   ```

2. **Verify backend is on http://localhost:8000:**
   ```bash
   curl http://localhost:8000/api/health
   ```
   Should return: `{"status":"healthy"}`

3. **Check the connection status indicator** in the app (top-right corner)
4. **Check backend logs** for startup errors:
   ```bash
   tail -20 backend.log
   ```

---

## 📝 First Time Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] OpenAI API key obtained
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` file created with `OPENAI_API_KEY` in `backend/` folder
- [ ] Database initialized (automatic on first run)
- [ ] Backend server running (check `backend.log` if issues)
- [ ] Frontend server running
- [ ] Browser opened to http://localhost:5173
- [ ] Account created (sign up with username, password, year, major)

---

## 🎓 Using the App

1. **Sign In/Sign Up** - Create an account (username, password, year, major). Your account is saved and remembered!
2. **Landing Page** - Explore features, learn how it works, and discover UNCW information
3. **Upload Documents** - Go to "Upload Documents" tab and upload PDFs, Word docs, or text files
4. **Ask Questions** - Switch to "Ask Questions" and ask anything (about your documents or general topics)
5. **Generate Quiz** - Create practice quizzes from your study materials on specific topics
6. **Create Flashcards** - Automatically generate flashcards from your documents
7. **Study Planner** - Use Pomodoro timer (25-min focus sessions) and track study goals
8. **UNCW Resources** - Quick access to library, STEM lab, and campus services

---

## 💡 Tips

- **Keep both terminals open** - Backend and frontend need to run simultaneously
- **Check the connection indicator** - Green = good, Red = backend offline
- **Use the startup script** - `./start.sh` is the easiest way to start everything
- **API Documentation** - Visit http://localhost:8000/docs to see all available endpoints

---

## 🆘 Still Having Issues?

1. Check that both servers are running
2. Verify your OpenAI API key is correct
3. Make sure ports 8000 and 5173 aren't blocked
4. Check the browser console (F12) for errors
5. Review the terminal output for error messages

---

**Need more help?** Check the main [README.md](README.md) for detailed information.
