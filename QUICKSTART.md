# 🚀 Quick Start Guide for Mac

## Step 1: Set Up Backend

Open Terminal and navigate to the project:

```bash
cd ~/Downloads/Projects/StudyAssistant/backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate the virtual environment:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```bash
nano .env
```

Add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_api_key_here
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

Start the backend server:

```bash
uvicorn app.main:app --reload
```

You should see: `Uvicorn running on http://127.0.0.1:8000`

**Keep this terminal window open!**

---

## Step 2: Set Up Frontend (New Terminal Window)

Open a **NEW** Terminal window (keep the backend running).

Navigate to frontend:

```bash
cd ~/Downloads/Projects/StudyAssistant/frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

You should see: `Local: http://localhost:5173/`

---

## Step 3: Open in Browser

The frontend will automatically open, or you can manually go to:

**http://localhost:5173**

---

## Troubleshooting

### If Python 3 is not found:
```bash
brew install python3
```

### If npm is not found:
```bash
brew install node
```

### If port 8000 is already in use:
Change the port in the uvicorn command:
```bash
uvicorn app.main:app --reload --port 8001
```

### If port 5173 is already in use:
Vite will automatically use the next available port.

---

## Stopping the Servers

- Backend: Press `Ctrl+C` in the backend terminal
- Frontend: Press `Ctrl+C` in the frontend terminal

