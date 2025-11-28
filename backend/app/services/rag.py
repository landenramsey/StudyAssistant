from typing import List, Optional
import os
from openai import OpenAI
from app.services.vector_store import VectorStore
from app.services.embeddings import EmbeddingService

class RAGService:
    def __init__(self, vector_store: VectorStore, embedding_service: EmbeddingService):
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
    
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
        
        if not results:
            return {
                "answer": "I couldn't find relevant information in your documents to answer this question.",
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
                model="gpt-4o-mini",  # or "gpt-4o" for better quality
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
            return {
                "answer": f"Error generating answer: {str(e)}",
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
            return {"questions": [], "topic": topic or "general"}
        
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
                model="gpt-4o-mini",
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
            return {"questions": [], "topic": topic or "general", "error": str(e)}
    
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
            # Get chunks from documents
            results = self.vector_store.search(
                self.embedding_service.embed_text("key concepts"),
                k=10
            )
            if document_ids:
                results = [r for r in results if r['document_id'] in document_ids]
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
                model="gpt-4o-mini",
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
            return {"cards": [], "error": str(e)}

