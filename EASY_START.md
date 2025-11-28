# ⚡ Easy Start Guide

## 🎯 One Command to Rule Them All

### Start Everything

```bash
./start.sh
```

**That's it!** The script will:
- ✅ Check and install dependencies automatically
- ✅ Start the backend server automatically
- ✅ Start the frontend server automatically
- ✅ Verify both servers started successfully
- ✅ Open your browser to the app
- ✅ Show you connection status

### Stop Everything

```bash
./stop.sh
```

---

## 📋 What You Need First

Before running `./start.sh`, make sure you have:

1. **OpenAI API Key** - Get one at https://platform.openai.com/api-keys
2. **Create `.env` file** in the `backend` folder:
   ```bash
   cd backend
   echo "OPENAI_API_KEY=your_key_here" > .env
   ```

---

## 🚀 First Time Setup

If this is your first time, run these commands once:

```bash
# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

**Note:** The `start.sh` script will automatically check and install dependencies if needed, so you can skip manual setup and just run `./start.sh`!

After that, you can always just use `./start.sh`!

---

## ✅ Verify It's Working

1. **Sign In Page** - You'll see the sign-in page first (create an account or sign in)
2. **Connection Status** - Look for green "🟢 Connected" in top-right corner
3. **Backend** - Should see "Uvicorn running on http://127.0.0.1:8000" in logs
4. **Frontend** - Should see "Local: http://localhost:5173" in logs
5. **Browser** - Should open automatically to the app
6. **Database** - User accounts are automatically saved and remembered

---

## 🔧 Quick Fixes

### Backend not starting?

1. **Check for missing dependencies:**
   ```bash
   cd backend
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Check backend logs:**
   ```bash
   tail -20 backend.log
   ```

3. **Start manually to see errors:**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```

### Frontend not starting?
```bash
cd frontend
npm run dev
```

### Port already in use?
```bash
./stop.sh  # Stop everything first
```

### "Cannot connect to server" error?

1. **Check if backend is running:**
   ```bash
   lsof -i :8000
   ```

2. **If not running, start it:**
   ```bash
   ./start.sh
   # Or manually:
   cd backend && source venv/bin/activate && uvicorn app.main:app --reload
   ```

3. **Check backend logs for errors:**
   ```bash
   tail -20 backend.log
   ```

---

## 📍 Important URLs

- **App**: http://localhost:5173
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

---

## 🎓 Using the App

1. **Sign In/Sign Up** - Create an account with your username, password, year, and major
2. **Landing Page** - Explore features, learn how it works, and read about UNCW
3. **Upload Documents** - Upload PDFs, Word docs, or text files to build your knowledge base
4. **Ask Questions** - Ask any question (about your documents or general topics)
5. **Generate Quiz** - Create practice quizzes tailored to your study materials
6. **Create Flashcards** - Automatically generate flashcards from your documents
7. **Study Planner** - Use Pomodoro timer and track study goals
8. **UNCW Resources** - Quick access to library, STEM lab, and campus services

---

## 💾 Your Data

- **User Accounts** - Stored securely in SQLite database (`data/users.db`)
- **Uploaded Documents** - Saved in `data/uploads/`
- **Vector Store** - Indexed in `vector_store/`
- **Remembered Login** - Your account is remembered when you return

---

**That's all you need!** Just run `./start.sh` and you're ready to go! 🎉
