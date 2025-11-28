# 🧠 AI Study Assistant

A personalized AI study assistant powered by RAG (Retrieval Augmented Generation) that helps you learn more effectively.

## Features

- 📄 **Document Upload**: Upload PDFs, Word docs, and text files
- 💬 **Q&A System**: Ask questions about your study materials
- 📝 **Quiz Generator**: Generate practice quizzes from your notes
- 🎴 **Flashcards**: Automatically create flashcards from documents
- 🔍 **Smart Search**: Uses vector embeddings for semantic search

## Tech Stack

### Backend
- FastAPI - Modern Python web framework
- Sentence Transformers - Embedding generation
- FAISS - Vector similarity search
- OpenAI GPT-4o - LLM for answers and generation
- PyPDF2, python-docx - Document processing

### Frontend
- React + Vite - Modern UI framework
- Axios - API client

## Setup

### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_key_here
```

6. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend

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

1. **Upload Documents**: Go to the "Upload Documents" tab and upload your study materials (PDF, DOCX, or TXT)

2. **Ask Questions**: Switch to "Ask Questions" and ask anything about your uploaded documents

3. **Generate Quizzes**: Create practice quizzes on specific topics from your materials

4. **Create Flashcards**: Generate flashcards automatically from your documents

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
│   │   ├── routers/  # API endpoints
│   │   ├── services/ # Business logic
│   │   └── models/   # Pydantic schemas
├── frontend/         # React frontend
│   └── src/
│       ├── components/
│       └── services/
├── data/             # Uploaded documents
└── vector_store/      # FAISS index
```

## Future Enhancements

- [ ] User authentication and document management
- [ ] Spaced repetition scheduling
- [ ] Performance tracking and weak topic recommendations
- [ ] Support for images with OCR
- [ ] Chrome extension for web page explanations
- [ ] Mobile app
- [ ] Multi-language support

## License

MIT

