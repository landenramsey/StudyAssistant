import { useState } from 'react';
import { askQuestion } from '../services/api';
import { FiMessageCircle, FiSend, FiLoader, FiFileText, FiTrendingUp } from 'react-icons/fi';
import './ChatInterface.css';

function ChatInterface({ documents }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question };
    setMessages([...messages, userMessage]);
    setLoading(true);
    setQuestion('');

    try {
      const response = await askQuestion(question);
      const assistantMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources || [],
        confidence: response.confidence,
      };
      setMessages([...messages, userMessage, assistantMessage]);
    } catch (error) {
      let errorMessage = 'Sorry, I encountered an error. ';
      if (error.message && error.message.includes('Cannot connect')) {
        errorMessage += 'Please make sure the backend server is running on http://localhost:8000';
      } else {
        errorMessage += error.response?.data?.detail || error.message || 'Please try again.';
      }
      setMessages([
        ...messages,
        userMessage,
        { role: 'assistant', content: errorMessage, sources: [], confidence: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="section-header">
        <FiMessageCircle className="section-icon" />
        <h2>Ask Questions</h2>
      </div>
      <p className="section-description">
        Ask any question - about your uploaded study materials or general topics. Get instant answers with source citations when available.
      </p>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <FiMessageCircle className="empty-icon" />
            <p>Start by asking any question!</p>
            <p className="empty-hint">Try: "Explain photosynthesis", "What is calculus?", or "Help me understand quantum physics"</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
            {msg.sources && msg.sources.length > 0 && (
              <div className="sources">
                <div className="sources-header">
                  <FiFileText className="sources-icon" />
                  <strong>Sources ({msg.sources.length})</strong>
                </div>
                {msg.sources.map((source, i) => (
                  <div key={i} className="source">
                    <span className="source-text">{source.text}</span>
                    <div className="source-meta">
                      <span className="source-score">
                        <FiTrendingUp className="score-icon" />
                        {source.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {msg.confidence !== undefined && msg.confidence > 0 && (
              <div className="confidence">
                <FiTrendingUp className="confidence-icon" />
                <span>Confidence: {(msg.confidence * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="message assistant loading">
            <FiLoader className="loading-icon spinning" />
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask any question - about your documents or general topics..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? (
            <FiLoader className="button-icon spinning" />
          ) : (
            <FiSend className="button-icon" />
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;
