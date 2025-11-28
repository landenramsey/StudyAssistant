import { useState } from 'react';
import { generateFlashcards } from '../services/api';
import { FiLayers, FiPlay, FiChevronLeft, FiChevronRight, FiRotateCw, FiLoader, FiInfo } from 'react-icons/fi';
import './FlashcardGenerator.css';

function FlashcardGenerator({ documents }) {
  const [text, setText] = useState('');
  const [numCards, setNumCards] = useState(10);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);

    try {
      const response = await generateFlashcards(text || null, numCards);
      if (!response.cards || response.cards.length === 0) {
        alert('No flashcards generated. Make sure you have uploaded documents first, or provide custom text.');
      }
      setCards(response.cards || []);
    } catch (error) {
      let errorMessage = 'Error generating flashcards: ';
      if (error.message && error.message.includes('Cannot connect')) {
        errorMessage += 'Please make sure the backend server is running on http://localhost:8000';
      } else {
        errorMessage += error.response?.data?.detail || error.message || 'Please try again.';
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  return (
    <div className="flashcard-generator">
      <div className="section-header">
        <FiLayers className="section-icon" />
        <h2>Flashcards</h2>
      </div>
      <p className="section-description">
        Create interactive flashcards from your study materials or custom text. Click to flip!
      </p>

      <div className="flashcard-controls">
        <div className="control-group">
          <label>
            <FiInfo className="label-icon" />
            Custom Text (optional - leave empty to use uploaded documents)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text here or leave empty to use uploaded documents..."
            rows="4"
          />
        </div>

        <div className="control-group">
          <label>
            <FiInfo className="label-icon" />
            Number of Cards
          </label>
          <input
            type="number"
            value={numCards}
            onChange={(e) => setNumCards(parseInt(e.target.value))}
            min="1"
            max="50"
          />
        </div>

        <button onClick={handleGenerate} disabled={loading} className="generate-button">
          {loading ? (
            <>
              <FiLoader className="button-icon spinning" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FiPlay className="button-icon" />
              <span>Generate Flashcards</span>
            </>
          )}
        </button>
      </div>

      {cards.length > 0 && (
        <div className="flashcard-viewer">
          <div className="flashcard-counter">
            <FiLayers className="counter-icon" />
            <span>Card {currentIndex + 1} of {cards.length}</span>
          </div>

          <div
            className={`flashcard ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div className="flashcard-content">
                  <div className="flashcard-label">
                    <FiInfo className="label-icon-small" />
                    Question
                  </div>
                  <p>{cards[currentIndex].front}</p>
                </div>
                <div className="flashcard-meta">
                  <span className={`difficulty ${cards[currentIndex].difficulty}`}>
                    {cards[currentIndex].difficulty}
                  </span>
                  <span className="importance">
                    Importance: {(cards[currentIndex].importance * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flip-hint">
                  <FiRotateCw className="hint-icon" />
                  Click to flip
                </div>
              </div>
              <div className="flashcard-back">
                <div className="flashcard-content">
                  <div className="flashcard-label">
                    <FiInfo className="label-icon-small" />
                    Answer
                  </div>
                  <p>{cards[currentIndex].back}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flashcard-nav">
            <button onClick={prevCard} disabled={currentIndex === 0} className="nav-button">
              <FiChevronLeft className="nav-icon" />
              <span>Previous</span>
            </button>
            <button onClick={() => setFlipped(!flipped)} className="nav-button flip-button">
              <FiRotateCw className="nav-icon" />
              <span>{flipped ? 'Show Question' : 'Show Answer'}</span>
            </button>
            <button onClick={nextCard} disabled={currentIndex === cards.length - 1} className="nav-button">
              <span>Next</span>
              <FiChevronRight className="nav-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlashcardGenerator;
