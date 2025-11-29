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
        top_k: int = 5,
        user_major: Optional[str] = None,
        user_year: Optional[str] = None
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
        
        # Check if vector store has any data or if we have results
        has_documents = self.vector_store.index is not None and self.vector_store.index.ntotal > 0
        has_results = len(results) > 0
        
        # Build context from retrieved chunks if available
        context = ""
        if has_results:
            context = "\n\n".join([f"[Source {i+1}]: {r['text']}" for i, r in enumerate(results)])
        
        # Build user context for personalization
        user_context = ""
        if user_major:
            # Handle multiple majors (comma-separated)
            majors = [m.strip() for m in user_major.split(',') if m.strip()]
            if len(majors) == 1:
                user_context += f"The student is a {majors[0]} major"
            elif len(majors) == 2:
                user_context += f"The student is double majoring in {majors[0]} and {majors[1]}"
            else:
                user_context += f"The student is majoring in {', '.join(majors[:-1])}, and {majors[-1]}"
            
            if user_year:
                user_context += f" in their {user_year} year"
            user_context += ". "
            user_context += "Tailor your answer to be relevant to their field(s) of study. Use examples and terminology appropriate for their major(s) when helpful. "
        
        # Generate answer using LLM - support both document-based and general questions
        if has_results:
            # Document-based answer
            prompt = f"""You are an expert study assistant for UNC Wilmington students. {user_context}Answer the following question based on the provided context from the user's study materials. Provide a comprehensive, detailed answer that demonstrates deep understanding.

Context from uploaded documents:
{context}

Question: {question}

Instructions:
- Provide a thorough, in-depth answer that shows deep understanding of the topic
- Explain concepts clearly and comprehensively
- Use examples relevant to the student's field when appropriate
- Cite which sources you used (e.g., "According to Source 1...")
- If the context doesn't fully answer the question, supplement with your extensive knowledge
- Break down complex concepts into understandable parts
- Connect ideas and show relationships between concepts

Answer:"""
        else:
            # General question - no documents or no relevant results
            if has_documents:
                prompt = f"""You are an expert study assistant for UNC Wilmington students. {user_context}The user asked a question, but no relevant information was found in their uploaded documents. Answer the question using your extensive knowledge. Provide a comprehensive, detailed explanation.

Question: {question}

Instructions:
- Provide a thorough, in-depth answer that demonstrates deep understanding
- Explain concepts clearly and comprehensively
- Use examples relevant to the student's field when appropriate
- Break down complex concepts into understandable parts
- Connect ideas and show relationships between concepts
- You can mention that this answer is based on general knowledge rather than their uploaded documents

Answer:"""
            else:
                prompt = f"""You are an expert study assistant for UNC Wilmington students. {user_context}Answer the following question. The user hasn't uploaded any documents yet, so answer using your extensive knowledge. Provide a comprehensive, detailed explanation.

Question: {question}

Instructions:
- Provide a thorough, in-depth answer that demonstrates deep understanding
- Explain concepts clearly and comprehensively
- Use examples relevant to the student's field when appropriate
- Break down complex concepts into understandable parts
- Connect ideas and show relationships between concepts
- You can mention that they can upload documents for more specific answers related to their study materials

Answer:"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are an expert study assistant for UNC Wilmington students. Provide comprehensive, detailed answers that demonstrate deep understanding of topics. Break down complex concepts clearly."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500  # Increased for deeper answers
            )
            
            answer = response.choices[0].message.content
            
            # Calculate confidence based on results
            if results:
                # Average confidence from retrieved chunks (scores are similarity scores 0-1)
                avg_confidence = sum(r['score'] for r in results) / len(results)
                # Normalize to 0-1 range and ensure reasonable confidence
                avg_confidence = min(1.0, max(0.3, avg_confidence))
            else:
                # For general questions without documents, use a base confidence
                # This represents confidence in the AI's general knowledge
                avg_confidence = 0.75  # 75% confidence for general knowledge answers
            
            # Always include sources, even if empty
            sources_list = [
                {
                    "text": r['text'][:300] + "..." if len(r['text']) > 300 else r['text'],
                    "document_id": r.get('document_id', 'unknown'),
                    "score": round(r['score'], 3),
                    "relevance": "High" if r['score'] > 0.7 else "Medium" if r['score'] > 0.5 else "Low"
                }
                for r in results
            ] if results else []
            
            return {
                "answer": answer,
                "sources": sources_list,
                "confidence": round(avg_confidence, 3)
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
            # Search for relevant chunks about the topic - use more specific query
            topic_query = f"about {topic} concepts definitions examples"
            query_embedding = self.embedding_service.embed_text(topic_query)
            results = self.vector_store.search(query_embedding, k=top_k * 2)  # Get more results to filter better
            
            # Filter results to only include those with high relevance to the topic
            # Re-rank by checking if topic keywords appear in the text
            topic_lower = topic.lower()
            filtered_results = []
            for r in results:
                text_lower = r['text'].lower()
                # Boost score if topic appears in text
                if topic_lower in text_lower:
                    r['score'] = min(1.0, r['score'] * 1.5)
                filtered_results.append(r)
            
            # Sort by score and take top_k
            results = sorted(filtered_results, key=lambda x: x['score'], reverse=True)[:top_k]
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
        
        context = "\n\n".join([r['text'] for r in results[:10]])  # Use more context
        
        topic_specific = f" focused specifically on {topic}" if topic else ""
        prompt = f"""Generate {num_questions} {question_type} questions{topic_specific} based EXCLUSIVELY on the following study material.

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

