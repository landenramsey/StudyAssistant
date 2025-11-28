# ⚡ Easy Start Guide

## 🎯 One Command to Rule Them All

### Start Everything

```bash
./start.sh
```

**That's it!** The script will:
- ✅ Start the backend server automatically
- ✅ Start the frontend server automatically
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

After that, you can always just use `./start.sh`!

---

## ✅ Verify It's Working

1. **Connection Status** - Look for green "🟢 Connected" in top-right corner
2. **Backend** - Should see "Uvicorn running on http://127.0.0.1:8000"
3. **Frontend** - Should see "Local: http://localhost:5173"
4. **Browser** - Should open automatically to the app

---

## 🔧 Quick Fixes

### Backend not starting?
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

---

## 📍 Important URLs

- **App**: http://localhost:5173
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs

---

**That's all you need!** Just run `./start.sh` and you're ready to go! 🎉
