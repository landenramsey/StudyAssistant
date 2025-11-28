import { useState, useEffect } from 'react';
import DocumentUpload from './components/DocumentUpload';
import ChatInterface from './components/ChatInterface';
import QuizGenerator from './components/QuizGenerator';
import FlashcardGenerator from './components/FlashcardGenerator';
import { checkHealth } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [documents, setDocuments] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkHealth();
      setIsConnected(result.status === 'ok');
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Connected' : '🔴 Backend Offline'}
      </div>
      <header className="app-header">
        <h1>🧠 AI Study Assistant</h1>
        <p>Your personalized learning companion</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          📄 Upload Documents
        </button>
        <button
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          💬 Ask Questions
        </button>
        <button
          className={activeTab === 'quiz' ? 'active' : ''}
          onClick={() => setActiveTab('quiz')}
        >
          📝 Generate Quiz
        </button>
        <button
          className={activeTab === 'flashcards' ? 'active' : ''}
          onClick={() => setActiveTab('flashcards')}
        >
          🎴 Flashcards
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'upload' && <DocumentUpload onUpload={(doc) => setDocuments([...documents, doc])} />}
        {activeTab === 'chat' && <ChatInterface documents={documents} />}
        {activeTab === 'quiz' && <QuizGenerator documents={documents} />}
        {activeTab === 'flashcards' && <FlashcardGenerator documents={documents} />}
      </main>
    </div>
  );
}

export default App;

