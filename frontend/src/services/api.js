import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const askQuestion = async (question, documentIds = null) => {
  const response = await api.post('/api/questions/ask', {
    question,
    document_ids: documentIds,
  });
  return response.data;
};

export const generateQuiz = async (topic, numQuestions, questionType, documentIds = null) => {
  const response = await api.post('/api/quizzes/generate', {
    topic,
    num_questions: numQuestions,
    question_type: questionType,
    document_ids: documentIds,
  });
  return response.data;
};

export const generateFlashcards = async (text, numCards, documentIds = null) => {
  const response = await api.post('/api/flashcards/generate', {
    text,
    num_cards: numCards,
    document_ids: documentIds,
  });
  return response.data;
};

