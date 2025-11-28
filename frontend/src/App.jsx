import { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
import DocumentUpload from './components/DocumentUpload';
import ChatInterface from './components/ChatInterface';
import QuizGenerator from './components/QuizGenerator';
import FlashcardGenerator from './components/FlashcardGenerator';
import StudyPlanner from './components/StudyPlanner';
import UNCWResources from './components/UNCWResources';
import { checkHealth } from './services/api';
import { FiUpload, FiMessageCircle, FiFileText, FiLayers, FiWifi, FiWifiOff, FiClock, FiMapPin, FiHome, FiLogOut } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [documents, setDocuments] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setShowSignIn(false);
        setShowLanding(false);
      } catch (e) {
        // Invalid data, clear it
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkHealth();
      setIsConnected(result.status === 'ok');
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSignIn = (userData) => {
    setUser(userData);
    setShowSignIn(false);
    setShowLanding(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowSignIn(true);
    setShowLanding(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
  };

  if (showSignIn) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} onLogout={handleLogout} user={user} />;
  }

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

      <div className="nav-actions">
        <button onClick={handleBackToLanding} className="nav-button home-button" title="Back to Home">
          <FiHome className="nav-icon" />
          <span>Home</span>
        </button>
        <button onClick={handleLogout} className="nav-button logout-button" title="Sign Out">
          <FiLogOut className="nav-icon" />
          <span>Sign Out</span>
        </button>
      </div>
      
      <header className="app-header">
        <div className="uncw-logo-header">
          <HiAcademicCap className="header-logo-icon" />
          <div className="header-logo-text">
            <span className="header-uncw">UNCW</span>
            <span className="header-study">Study Assistant</span>
          </div>
        </div>
        <h1>Study Assistant</h1>
        <p className="uncw-badge">For UNC Wilmington Students</p>
        {user && (
          <p className="user-info">
            Welcome, {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}! • {user.major} • {user.year}
          </p>
        )}
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
        <button
          className={activeTab === 'planner' ? 'active' : ''}
          onClick={() => setActiveTab('planner')}
        >
          <FiClock className="tab-icon" />
          <span>Study Planner</span>
        </button>
        <button
          className={activeTab === 'resources' ? 'active' : ''}
          onClick={() => setActiveTab('resources')}
        >
          <FiMapPin className="tab-icon" />
          <span>UNCW Resources</span>
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'upload' && <DocumentUpload onUpload={(doc) => setDocuments([...documents, doc])} />}
        {activeTab === 'chat' && <ChatInterface documents={documents} user={user} />}
        {activeTab === 'quiz' && <QuizGenerator documents={documents} />}
        {activeTab === 'flashcards' && <FlashcardGenerator documents={documents} />}
        {activeTab === 'planner' && <StudyPlanner />}
        {activeTab === 'resources' && <UNCWResources />}
      </main>
    </div>
  );
}

export default App;
