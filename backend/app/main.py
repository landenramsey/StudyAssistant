# Load environment variables FIRST, before any other imports
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import documents, questions, quizzes, flashcards, auth

app = FastAPI(
    title="AI Study Assistant API",
    description="Personalized AI Study Assistant with RAG",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(questions.router, prefix="/api/questions", tags=["questions"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["quizzes"])
app.include_router(flashcards.router, prefix="/api/flashcards", tags=["flashcards"])

@app.get("/")
async def root():
    return {"message": "AI Study Assistant API is running"}

@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "Backend is running"}

@app.get("/api/test-openai")
async def test_openai():
    """Test OpenAI API connection."""
    import os
    from openai import OpenAI
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"status": "error", "message": "OPENAI_API_KEY not found in environment"}
    
    try:
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Say 'API test successful' if you can read this."}],
            max_tokens=10
        )
        return {
            "status": "success",
            "message": response.choices[0].message.content,
            "model": "gpt-4o-mini"
        }
    except Exception as e:
        error_msg = str(e)
        if "api_key" in error_msg.lower() or "authentication" in error_msg.lower():
            error_msg = "Invalid API key"
        elif "rate limit" in error_msg.lower():
            error_msg = "Rate limit exceeded"
        elif "insufficient_quota" in error_msg.lower():
            error_msg = "Insufficient quota - check billing"
        
        return {"status": "error", "message": error_msg}

