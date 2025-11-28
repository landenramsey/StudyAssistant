import { useState, useEffect } from 'react';
import DocumentUpload from './components/DocumentUpload';
import ChatInterface from './components/ChatInterface';
import QuizGenerator from './components/QuizGenerator';
import FlashcardGenerator from './components/FlashcardGenerator';
import { checkHealth } from './services/api';
import { FiUpload, FiMessageCircle, FiFileText, FiLayers, FiWifi, FiWifiOff } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';
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
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? (
          <>
            <FiWifi className="status-icon" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <FiWifiOff className="status-icon" />
            <span>Backend Offline</span>
          </>
        )}
      </div>
      
      <header className="app-header">
        <div className="header-icon">
          <HiAcademicCap />
        </div>
        <h1>Study Assistant</h1>
        <p>Transform your study materials into interactive learning tools</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          <FiUpload className="tab-icon" />
          <span>Upload</span>
        </button>
        <button
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          <FiMessageCircle className="tab-icon" />
          <span>Ask Questions</span>
        </button>
        <button
          className={activeTab === 'quiz' ? 'active' : ''}
          onClick={() => setActiveTab('quiz')}
        >
          <FiFileText className="tab-icon" />
          <span>Quiz</span>
        </button>
        <button
          className={activeTab === 'flashcards' ? 'active' : ''}
          onClick={() => setActiveTab('flashcards')}
        >
          <FiLayers className="tab-icon" />
          <span>Flashcards</span>
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
