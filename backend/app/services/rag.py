from typing import List, Optional
import os
from openai import OpenAI
from app.services.vector_store import VectorStore
from app.services.embeddings import EmbeddingService

class RAGService:
    def __init__(self, vector_store: VectorStore, embedding_service: EmbeddingService):
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        
        # Support both Azure OpenAI and regular OpenAI
        azure_api_key = os.getenv("AZURE_OPENAI_API_KEY")
        azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        azure_api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
        openai_api_key = os.getenv("OPENAI_API_KEY")
        
        if azure_api_key and azure_endpoint:
            # Use Azure OpenAI
            from openai import AzureOpenAI
            self.client = AzureOpenAI(
                api_key=azure_api_key,
                api_version=azure_api_version,
                azure_endpoint=azure_endpoint
            )
            self.model_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o-mini")
            self.use_azure = True
        elif openai_api_key:
            # Use regular OpenAI
            self.client = OpenAI(api_key=openai_api_key)
            self.model_name = "gpt-4o-mini"
            self.use_azure = False
        else:
            raise ValueError("Either OPENAI_API_KEY or (AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT) must be set")
    
    def answer_question(
        self, 
        question: str, 
        document_ids: Optional[List[str]] = None,
        top_k: int = 5
    ) -> dict:
        """
        Answer a question using RAG.
        
        Args:
            question: User's question
            document_ids: Optional list of document IDs to search in
            top_k: Number of chunks to retrieve
        
        Returns:
            dict with answer, sources, and confidence
        """
        # Embed the question
        query_embedding = self.embedding_service.embed_text(question)
        
        # Search for relevant chunks
        results = self.vector_store.search(query_embedding, k=top_k)
        
        # Filter by document_ids if provided
        if document_ids:
            results = [r for r in results if r['document_id'] in document_ids]
        
        # Check if vector store has any data
        if self.vector_store.index is None or self.vector_store.index.ntotal == 0:
            return {
                "answer": "No documents have been uploaded yet. Please upload documents first before asking questions.",
                "sources": [],
                "confidence": 0.0
            }
        
        if not results:
            return {
                "answer": "I couldn't find relevant information in your documents to answer this question. Try uploading more documents or rephrasing your question.",
                "sources": [],
                "confidence": 0.0
            }
        
        # Build context from retrieved chunks
        context = "\n\n".join([f"[Source {i+1}]: {r['text']}" for i, r in enumerate(results)])
        
        # Generate answer using LLM
        prompt = f"""You are a helpful study assistant. Answer the following question based on the provided context from the user's study materials.

Context:
{context}

Question: {question}

Provide a clear, concise answer. If the context doesn't contain enough information, say so. Cite which sources you used (e.g., "According to Source 1...").

Answer:"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are a helpful study assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            answer = response.choices[0].message.content
            
            # Calculate average confidence from retrieved chunks
            avg_confidence = sum(r['score'] for r in results) / len(results)
            
            return {
                "answer": answer,
                "sources": [
                    {
                        "text": r['text'][:200] + "...",
                        "document_id": r['document_id'],
                        "score": r['score']
                    }
                    for r in results
                ],
                "confidence": avg_confidence
            }
        except Exception as e:
            import traceback
            error_msg = str(e)
            # Check for common OpenAI API errors
            if "api_key" in error_msg.lower() or "authentication" in error_msg.lower():
                error_msg = "Invalid OpenAI API key. Please check your .env file."
            elif "rate limit" in error_msg.lower():
                error_msg = "OpenAI API rate limit exceeded. Please try again later."
            elif "insufficient_quota" in error_msg.lower():
                error_msg = "OpenAI API quota exceeded. Please check your account billing."
            
            print(f"Error in answer_question: {error_msg}")
            print(traceback.format_exc())
            
            return {
                "answer": f"Error: {error_msg}",
                "sources": [],
                "confidence": 0.0
            }
    
    def generate_quiz(
        self,
        topic: Optional[str],
        num_questions: int,
        question_type: str,
        document_ids: Optional[List[str]] = None,
        top_k: int = 10
    ) -> dict:
        """Generate quiz questions from documents."""
        # Check if vector store has any data
        if self.vector_store.index is None or self.vector_store.index.ntotal == 0:
            return {
                "questions": [], 
                "topic": topic or "general",
                "error": "No documents uploaded yet. Please upload documents first."
            }
        
        if topic:
            # Search for relevant chunks about the topic
            query_embedding = self.embedding_service.embed_text(topic)
            results = self.vector_store.search(query_embedding, k=top_k)
        else:
            # Get random chunks
            results = self.vector_store.search(
                self.embedding_service.embed_text("study material"),
                k=top_k
            )
        
        if document_ids:
            results = [r for r in results if r['document_id'] in document_ids]
        
        if not results:
            return {
                "questions": [], 
                "topic": topic or "general",
                "error": "No relevant content found. Try uploading more documents or using a different topic."
            }
        
        context = "\n\n".join([r['text'] for r in results[:5]])
        
        prompt = f"""Generate {num_questions} {question_type} questions based on the following study material.

Study Material:
{context}

Generate questions that test understanding, not just memorization. For multiple choice questions, provide 4 options and indicate the correct answer.

Format your response as JSON with this structure:
{{
  "questions": [
    {{
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Why this answer is correct"
    }}
  ]
}}"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are a quiz generator for study materials."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                response_format={"type": "json_object"}
            )
            
            import json
            quiz_data = json.loads(response.choices[0].message.content)
            quiz_data["topic"] = topic or "general"
            return quiz_data
        except Exception as e:
            import traceback
            error_msg = str(e)
            if "api_key" in error_msg.lower() or "authentication" in error_msg.lower():
                error_msg = "Invalid OpenAI API key. Please check your .env file."
            elif "rate limit" in error_msg.lower():
                error_msg = "OpenAI API rate limit exceeded. Please try again later."
            elif "insufficient_quota" in error_msg.lower():
                error_msg = "OpenAI API quota exceeded. Please check your account billing."
            
            print(f"Error in generate_quiz: {error_msg}")
            print(traceback.format_exc())
            
            return {"questions": [], "topic": topic or "general", "error": error_msg}
    
    def generate_flashcards(
        self,
        text: Optional[str],
        num_cards: int,
        document_ids: Optional[List[str]] = None
    ) -> dict:
        """Generate flashcards from text or documents."""
        if text:
            context = text
        else:
            # Check if vector store has any data
            if self.vector_store.index is None or self.vector_store.index.ntotal == 0:
                return {
                    "cards": [],
                    "error": "No documents uploaded yet. Please upload documents first or provide custom text."
                }
            
            # Get chunks from documents
            results = self.vector_store.search(
                self.embedding_service.embed_text("key concepts"),
                k=10
            )
            if document_ids:
                results = [r for r in results if r['document_id'] in document_ids]
            
            if not results:
                return {
                    "cards": [],
                    "error": "No content found. Please upload documents first or provide custom text."
                }
            
            context = "\n\n".join([r['text'] for r in results])
        
        prompt = f"""Create {num_cards} flashcards from the following study material. Each flashcard should have:
- A clear question on the front
- A concise answer on the back
- A difficulty level (easy, medium, hard)
- An importance score (0.0 to 1.0)

Study Material:
{context}

Format as JSON:
{{
  "cards": [
    {{
      "front": "Question",
      "back": "Answer",
      "difficulty": "medium",
      "importance": 0.8
    }}
  ]
}}"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are a flashcard generator."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            import json
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            import traceback
            error_msg = str(e)
            if "api_key" in error_msg.lower() or "authentication" in error_msg.lower():
                error_msg = "Invalid OpenAI API key. Please check your .env file."
            elif "rate limit" in error_msg.lower():
                error_msg = "OpenAI API rate limit exceeded. Please try again later."
            elif "insufficient_quota" in error_msg.lower():
                error_msg = "OpenAI API quota exceeded. Please check your account billing."
            
            print(f"Error in generate_flashcards: {error_msg}")
            print(traceback.format_exc())
            
            return {"cards": [], "error": error_msg}

