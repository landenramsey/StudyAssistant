import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      error.message = 'Cannot connect to server. Make sure the backend is running on http://localhost:8000';
    }
    return Promise.reject(error);
  }
);

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 60 seconds for file uploads
  });
  
  return response.data;
};

export const askQuestion = async (question, documentIds = null, userMajor = null, userYear = null) => {
  const response = await api.post('/api/questions/ask', {
    question,
    document_ids: documentIds,
    user_major: userMajor,
    user_year: userYear,
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

// Authentication functions
export const signUp = async (username, password, year, major) => {
  try {
    const response = await api.post('/api/auth/signup', {
      username,
      password,
      year,
      major,
    }, {
      timeout: 10000, // 10 seconds for auth
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Connection timeout. Please ensure the backend server is running.');
    }
    throw error;
  }
};

export const signIn = async (username, password) => {
  try {
    const response = await api.post('/api/auth/signin', {
      username,
      password,
    }, {
      timeout: 10000, // 10 seconds for auth
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Connection timeout. Please ensure the backend server is running.');
    }
    throw error;
  }
};

export const getUser = async (username) => {
  const response = await api.get(`/api/auth/user/${username}`);
  return response.data;
};

// Health check function
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health', { timeout: 5000 });
    // Backend returns {status: "ok"} or {status: "healthy"}
    const backendStatus = response.data?.status;
    if (backendStatus === 'ok' || backendStatus === 'healthy') {
      return { status: 'ok', data: response.data };
    }
    return { status: 'error', message: 'Backend returned unexpected status' };
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.message?.includes('timeout')) {
      return { status: 'error', message: 'Cannot connect to backend server' };
    }
    return { status: 'error', message: error.message || 'Backend connection failed' };
  }
};
