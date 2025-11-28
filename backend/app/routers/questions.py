from fastapi import APIRouter
from app.models.schemas import QuestionRequest, QuestionResponse
from app.services.rag import RAGService
from app.services.embeddings import EmbeddingService
from app.services.vector_store import VectorStore

router = APIRouter()

# Initialize services
embedding_service = EmbeddingService()
vector_store = VectorStore()
vector_store.load(embedding_service.get_dimension())
rag_service = RAGService(vector_store, embedding_service)

@router.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    """Answer a question using RAG."""
    result = rag_service.answer_question(
        question=request.question,
        document_ids=request.document_ids
    )
    
    return QuestionResponse(
        answer=result["answer"],
        sources=result["sources"],
        confidence=result["confidence"]
    )

