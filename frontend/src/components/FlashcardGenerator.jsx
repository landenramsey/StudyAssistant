import { useState } from 'react';
import { generateFlashcards } from '../services/api';
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
      setCards(response.cards || []);
    } catch (error) {
      alert('Error generating flashcards: ' + (error.response?.data?.detail || error.message));
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
      <h2>Generate Flashcards</h2>
      <p>Create flashcards from your study materials or custom text</p>

      <div className="flashcard-controls">
        <div className="control-group">
          <label>Custom Text (optional, leave empty to use documents):</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text here or leave empty to use uploaded documents..."
            rows="4"
          />
        </div>

        <div className="control-group">
          <label>Number of Cards:</label>
          <input
            type="number"
            value={numCards}
            onChange={(e) => setNumCards(parseInt(e.target.value))}
            min="1"
            max="50"
          />
        </div>

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </div>

      {cards.length > 0 && (
        <div className="flashcard-viewer">
          <div className="flashcard-counter">
            Card {currentIndex + 1} of {cards.length}
          </div>

          <div
            className={`flashcard ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div className="flashcard-content">
                  <h3>Question</h3>
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
              </div>
              <div className="flashcard-back">
                <div className="flashcard-content">
                  <h3>Answer</h3>
                  <p>{cards[currentIndex].back}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flashcard-nav">
            <button onClick={prevCard} disabled={currentIndex === 0}>
              ← Previous
            </button>
            <button onClick={() => setFlipped(!flipped)}>
              {flipped ? 'Show Question' : 'Show Answer'}
            </button>
            <button onClick={nextCard} disabled={currentIndex === cards.length - 1}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlashcardGenerator;

