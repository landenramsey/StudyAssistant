# 🧠 AI Study Assistant

A personalized AI study assistant powered by RAG (Retrieval Augmented Generation) that helps you learn more effectively.

## Features

- 🔐 **User Authentication**: Secure sign up/sign in with database storage
- 📄 **Document Upload**: Upload PDFs, Word docs, and text files
- 💬 **Q&A System**: Ask any question - about your documents or general topics
- 📝 **Quiz Generator**: Generate practice quizzes from your notes on specific topics
- 🎴 **Flashcards**: Automatically create flashcards from documents
- ⏱️ **Study Planner**: Pomodoro timer with focus sessions and study goals
- 🏫 **UNCW Resources**: Quick access to library, STEM lab, and campus services
- 🔍 **Smart Search**: Uses vector embeddings for semantic search
- 🎯 **Personalized**: Answers tailored to your major and year

## Tech Stack

### Backend
- FastAPI - Modern Python web framework
- SQLAlchemy + SQLite - User database and authentication
- Passlib + bcrypt - Secure password hashing
- Sentence Transformers - Embedding generation
- FAISS - Vector similarity search
- OpenAI GPT-4o/gpt-4o-mini - LLM for answers and generation
- PyPDF2, python-docx - Document processing

### Frontend
- React + Vite - Modern UI framework
- React Icons - Beautiful icon library
- Axios - API client
- Modern CSS with glassmorphism and animations

## Setup

### ⚡ Quick Start (Recommended)

Simply run from the project root:

```bash
./start.sh
```

This will automatically:
- Check and install dependencies
- Start the backend server
- Start the frontend server
- Open your browser
- Verify everything is running

**To stop everything:**
```bash
./stop.sh
```

### Manual Setup

#### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
echo "OPENAI_API_KEY=your_key_here" > .env
```

5. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

#### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

1. **Sign Up/Sign In**: Create an account with your username, password, year, and major. Your account is saved and remembered!

2. **Explore Landing Page**: Learn about features, how it works, and UNCW information

3. **Upload Documents**: Go to the "Upload Documents" tab and upload your study materials (PDF, DOCX, or TXT)

4. **Ask Questions**: Switch to "Ask Questions" and ask anything - about your documents or general topics. Answers are personalized to your major!

5. **Generate Quizzes**: Create practice quizzes on specific topics from your materials

6. **Create Flashcards**: Generate flashcards automatically from your documents

7. **Study Planner**: Use the Pomodoro timer (25-min focus sessions) and track study goals

8. **UNCW Resources**: Access library, STEM lab, and campus services

## Architecture

```
User Upload → Document Processing → Chunking → Embedding → Vector Store (FAISS)
                                                                    ↓
User Question → Embedding → Similarity Search → Retrieve Chunks → LLM → Answer
```

## Project Structure

```
StudyAssistant/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── main.py   # FastAPI app
│   │   ├── database.py  # SQLite database setup
│   │   ├── routers/  # API endpoints (auth, documents, questions, etc.)
│   │   ├── services/ # Business logic (RAG, embeddings, vector store)
│   │   └── models/   # Pydantic schemas
│   ├── requirements.txt
│   └── venv/         # Python virtual environment
├── frontend/         # React frontend
│   └── src/
│       ├── components/  # React components
│       └── services/    # API client
├── data/             # User data and uploads
│   ├── uploads/      # Uploaded documents
│   └── users.db      # SQLite database (created automatically)
├── vector_store/     # FAISS index
├── start.sh          # One-command startup script
└── stop.sh           # Stop all servers
```

## Key Features

- ✅ **User Authentication** - Secure sign up/sign in with database storage
- ✅ **Personalized Answers** - Tailored to your major and year
- ✅ **Document Management** - Upload and process PDFs, Word docs, and text files
- ✅ **Smart Q&A** - Ask any question, not just about documents
- ✅ **Quiz Generation** - Topic-specific quizzes from your materials
- ✅ **Flashcard Creation** - Automatic flashcard generation
- ✅ **Study Planner** - Pomodoro timer and goal tracking
- ✅ **UNCW Integration** - Campus resources and information
- ✅ **Modern UI** - Clean, professional design with UNCW branding

## Future Enhancements

- [ ] Spaced repetition scheduling
- [ ] Performance tracking and weak topic recommendations
- [ ] Support for images with OCR
- [ ] Chrome extension for web page explanations
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Study session analytics

## License

MIT

