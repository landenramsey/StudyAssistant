import { useState } from 'react';
import { generateQuiz } from '../services/api';
import './QuizGenerator.css';

function QuizGenerator({ documents }) {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);

    try {
      const response = await generateQuiz(topic, numQuestions, questionType);
      if (response.questions && response.questions.length === 0) {
        alert('No questions generated. Make sure you have uploaded documents first, or try a different topic.');
      }
      setQuiz(response);
    } catch (error) {
      let errorMessage = 'Error generating quiz: ';
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

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) correct++;
    });
    return correct;
  };

  return (
    <div className="quiz-generator">
      <h2>Generate Practice Quiz</h2>
      <p>Create custom quizzes from your study materials</p>

      <div className="quiz-controls">
        <div className="control-group">
          <label>Topic (optional):</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Biology, Calculus..."
          />
        </div>

        <div className="control-group">
          <label>Number of Questions:</label>
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            min="1"
            max="20"
          />
        </div>

        <div className="control-group">
          <label>Question Type:</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="short_answer">Short Answer</option>
          </select>
        </div>

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      {quiz && (
        <div className="quiz-content">
          <h3>Quiz: {quiz.topic}</h3>
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="question-card">
              <div className="question-number">Question {idx + 1}</div>
              <div className="question-text">{q.question}</div>
              <div className="options">
                {q.options.map((option, optIdx) => (
                  <label
                    key={optIdx}
                    className={`option ${
                      submitted
                        ? optIdx === q.correct_answer
                          ? 'correct'
                          : answers[idx] === optIdx && optIdx !== q.correct_answer
                          ? 'incorrect'
                          : ''
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={optIdx}
                      checked={answers[idx] === optIdx}
                      onChange={() => {
                        const newAnswers = { ...answers };
                        newAnswers[idx] = optIdx;
                        setAnswers(newAnswers);
                      }}
                      disabled={submitted}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {submitted && (
                <div className="explanation">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}

          {!submitted ? (
            <button className="submit-quiz" onClick={handleSubmit}>
              Submit Quiz
            </button>
          ) : (
            <div className="quiz-results">
              <h3>Your Score: {getScore()} / {quiz.questions.length}</h3>
              <p>{(getScore() / quiz.questions.length * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizGenerator;

