import { useState } from 'react';
import { askQuestion } from '../services/api';
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
        sources: response.sources,
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
        { role: 'assistant', content: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <h2>Ask Questions About Your Notes</h2>
      <p>Ask anything about your uploaded study materials!</p>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>👋 Start by asking a question about your study materials!</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
            {msg.sources && msg.sources.length > 0 && (
              <div className="sources">
                <strong>Sources:</strong>
                {msg.sources.map((source, i) => (
                  <div key={i} className="source">
                    <span className="source-text">{source.text}</span>
                    <span className="source-score">Score: {source.score.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            {msg.confidence && (
              <div className="confidence">
                Confidence: {(msg.confidence * 100).toFixed(1)}%
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !question.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;

