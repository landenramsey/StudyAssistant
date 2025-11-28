import { useState } from 'react';
import { generateQuiz } from '../services/api';
import { FiFileText, FiPlay, FiCheckCircle, FiXCircle, FiInfo, FiLoader } from 'react-icons/fi';
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
      <div className="section-header">
        <FiFileText className="section-icon" />
        <h2>Generate Quiz</h2>
      </div>
      <p className="section-description">
        Create custom practice quizzes from your study materials. Specify a topic to focus on specific content.
      </p>

      <div className="quiz-controls">
        <div className="control-group">
          <label>
            <FiInfo className="label-icon" />
            Topic (optional - leave empty for general quiz)
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Calculus, Biology, World War II..."
          />
        </div>

        <div className="control-group">
          <label>
            <FiInfo className="label-icon" />
            Number of Questions
          </label>
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            min="1"
            max="20"
          />
        </div>

        <div className="control-group">
          <label>
            <FiInfo className="label-icon" />
            Question Type
          </label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="short_answer">Short Answer</option>
          </select>
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
              <span>Generate Quiz</span>
            </>
          )}
        </button>
      </div>

      {quiz && (
        <div className="quiz-content">
          <h3>
            <FiFileText className="quiz-icon" />
            Quiz: {quiz.topic}
          </h3>
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="question-card">
              <div className="question-number">
                Question {idx + 1} of {quiz.questions.length}
              </div>
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
                    <span className="option-label">{String.fromCharCode(65 + optIdx)}.</span>
                    <span className="option-text">{option}</span>
                    {submitted && optIdx === q.correct_answer && (
                      <FiCheckCircle className="option-icon correct-icon" />
                    )}
                    {submitted && answers[idx] === optIdx && optIdx !== q.correct_answer && (
                      <FiXCircle className="option-icon incorrect-icon" />
                    )}
                  </label>
                ))}
              </div>
              {submitted && (
                <div className="explanation">
                  <FiInfo className="explanation-icon" />
                  <div>
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}

          {!submitted ? (
            <button className="submit-quiz" onClick={handleSubmit}>
              <FiCheckCircle className="button-icon" />
              <span>Submit Quiz</span>
            </button>
          ) : (
            <div className="quiz-results">
              <FiCheckCircle className="results-icon" />
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
