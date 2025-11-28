from pydantic import BaseModel
from typing import List, Optional

class DocumentUpload(BaseModel):
    filename: str
    content_type: str

class DocumentResponse(BaseModel):
    id: str
    filename: str
    chunks_count: int
    status: str

class QuestionRequest(BaseModel):
    question: str
    document_ids: Optional[List[str]] = None

class QuestionResponse(BaseModel):
    answer: str
    sources: List[dict]
    confidence: float

class QuizRequest(BaseModel):
    topic: Optional[str] = None
    num_questions: int = 5
    question_type: str = "multiple_choice"
    document_ids: Optional[List[str]] = None

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]
    topic: str

class FlashcardRequest(BaseModel):
    text: Optional[str] = None
    num_cards: int = 10
    document_ids: Optional[List[str]] = None

class Flashcard(BaseModel):
    front: str
    back: str
    difficulty: str
    importance: float

class FlashcardResponse(BaseModel):
    cards: List[Flashcard]

