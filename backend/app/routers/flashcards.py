from fastapi import APIRouter
from app.models.schemas import FlashcardRequest, FlashcardResponse, Flashcard
from app.services.rag import RAGService
from app.services.embeddings import EmbeddingService
from app.services.vector_store import VectorStore

router = APIRouter()

embedding_service = EmbeddingService()
vector_store = VectorStore()
vector_store.load(embedding_service.get_dimension())
rag_service = RAGService(vector_store, embedding_service)

@router.post("/generate", response_model=FlashcardResponse)
async def generate_flashcards(request: FlashcardRequest):
    """Generate flashcards from text or documents."""
    try:
        result = rag_service.generate_flashcards(
            text=request.text,
            num_cards=request.num_cards,
            document_ids=request.document_ids
        )
        
        # Check for errors
        if "error" in result:
            # Return empty cards with error info
            return FlashcardResponse(cards=[])
        
        cards = [
            Flashcard(**c) for c in result.get("cards", [])
        ]
        
        return FlashcardResponse(cards=cards)
    except Exception as e:
        import traceback
        print(f"Error in generate_flashcards endpoint: {str(e)}")
        print(traceback.format_exc())
        return FlashcardResponse(cards=[])

