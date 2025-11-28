from fastapi import APIRouter
from app.models.schemas import QuizRequest, QuizResponse, QuizQuestion
from app.services.rag import RAGService
from app.services.embeddings import EmbeddingService
from app.services.vector_store import VectorStore

router = APIRouter()

embedding_service = EmbeddingService()
vector_store = VectorStore()
vector_store.load(embedding_service.get_dimension())
rag_service = RAGService(vector_store, embedding_service)

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generate a quiz from documents."""
    try:
        result = rag_service.generate_quiz(
            topic=request.topic,
            num_questions=request.num_questions,
            question_type=request.question_type,
            document_ids=request.document_ids
        )
        
        # Check for errors
        if "error" in result:
            # Return empty quiz with error info
            return QuizResponse(
                questions=[],
                topic=result.get("topic", "general")
            )
        
        questions = [
            QuizQuestion(**q) for q in result.get("questions", [])
        ]
        
        return QuizResponse(
            questions=questions,
            topic=result.get("topic", "general")
        )
    except Exception as e:
        import traceback
        print(f"Error in generate_quiz endpoint: {str(e)}")
        print(traceback.format_exc())
        return QuizResponse(
            questions=[],
            topic=request.topic or "general"
        )

