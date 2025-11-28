from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os
import uuid
from pathlib import Path
from app.models.schemas import DocumentResponse
from app.services.document_processor import DocumentProcessor
from app.services.embeddings import EmbeddingService
from app.services.vector_store import VectorStore

router = APIRouter()

# Initialize services (in production, use dependency injection)
embedding_service = EmbeddingService()
vector_store = VectorStore()
vector_store.load(embedding_service.get_dimension())

# Path relative to project root
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
UPLOAD_DIR = PROJECT_ROOT / "data" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document."""
    try:
        # Save file
        document_id = str(uuid.uuid4())
        file_path = UPLOAD_DIR / f"{document_id}_{file.filename}"
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Process file
        processor = DocumentProcessor()
        text, chunks = processor.process_file(str(file_path), file.content_type)
        
        # Generate embeddings
        embeddings = embedding_service.embed_batch(chunks)
        
        # Add to vector store
        metadata = [(document_id, i, chunk) for i, chunk in enumerate(chunks)]
        vector_store.add_embeddings(embeddings, metadata)
        vector_store.save()
        
        return DocumentResponse(
            id=document_id,
            filename=file.filename,
            chunks_count=len(chunks),
            status="processed"
        )
    except Exception as e:
        import traceback
        error_msg = str(e)
        print(f"Error in upload_document: {error_msg}")
        print(traceback.format_exc())
        
        # Provide more helpful error messages
        if "Unsupported file type" in error_msg:
            error_msg = f"Unsupported file type. Please upload PDF, DOCX, or TXT files only."
        elif "No such file" in error_msg or "Permission denied" in error_msg:
            error_msg = "File upload failed. Please check file permissions."
        
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/list")
async def list_documents():
    """List all uploaded documents."""
    # In production, store document metadata in a database
    return {"documents": []}

@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """Delete a document."""
    # In production, implement proper deletion
    return {"message": "Document deleted"}

