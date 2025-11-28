import { useState, useEffect } from 'react';
import { FiClock, FiPlay, FiPause, FiRotateCw, FiCheckCircle, FiTarget } from 'react-icons/fi';
import './StudyPlanner.css';

function StudyPlanner() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('pomodoro'); // pomodoro, short-break, long-break
  const [completedSessions, setCompletedSessions] = useState(0);
  const [studyGoals, setStudyGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  const sessionTimes = {
    pomodoro: 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (sessionType === 'pomodoro') {
        setCompletedSessions(prev => prev + 1);
        // Auto-switch to break after pomodoro
        if ((completedSessions + 1) % 4 === 0) {
          setSessionType('long-break');
          setTimeLeft(sessionTimes['long-break']);
        } else {
          setSessionType('short-break');
          setTimeLeft(sessionTimes['short-break']);
        }
      } else {
        // After break, switch back to pomodoro
        setSessionType('pomodoro');
        setTimeLeft(sessionTimes.pomodoro);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionType, completedSessions]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionTimes[sessionType]);
  };

  const switchSession = (type) => {
    if (!isRunning) {
      setSessionType(type);
      setTimeLeft(sessionTimes[type]);
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setStudyGoals([...studyGoals, { id: Date.now(), text: newGoal, completed: false }]);
      setNewGoal('');
    }
  };

  const toggleGoal = (id) => {
    setStudyGoals(goals =>
      goals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  return (
    <div className="study-planner">
      <div className="section-header">
        <FiClock className="section-icon" />
        <h2>Study Planner</h2>
      </div>
      <p className="section-description">
        Use the Pomodoro Technique to stay focused. Work for 25 minutes, then take a break!
      </p>

      <div className="planner-content">
        <div className="timer-section">
          <div className="session-selector">
            <button
              className={sessionType === 'pomodoro' ? 'active' : ''}
              onClick={() => switchSession('pomodoro')}
              disabled={isRunning}
            >
              Focus
            </button>
            <button
              className={sessionType === 'short-break' ? 'active' : ''}
              onClick={() => switchSession('short-break')}
              disabled={isRunning}
            >
              Short Break
            </button>
            <button
              className={sessionType === 'long-break' ? 'active' : ''}
              onClick={() => switchSession('long-break')}
              disabled={isRunning}
            >
              Long Break
            </button>
          </div>

          <div className={`timer-display ${sessionType}`}>
            <div className="timer-time">{formatTime(timeLeft)}</div>
            <div className="timer-controls">
              {!isRunning ? (
                <button onClick={startTimer} className="timer-button start">
                  <FiPlay className="button-icon" />
                  <span>Start</span>
                </button>
              ) : (
                <button onClick={pauseTimer} className="timer-button pause">
                  <FiPause className="button-icon" />
                  <span>Pause</span>
                </button>
              )}
              <button onClick={resetTimer} className="timer-button reset">
                <FiRotateCw className="button-icon" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="session-stats">
            <div className="stat-item">
              <FiCheckCircle className="stat-icon" />
              <span>Completed: {completedSessions}</span>
            </div>
            <div className="stat-item">
              <FiTarget className="stat-icon" />
              <span>Today's Goal: {completedSessions * 25} min</span>
            </div>
          </div>
        </div>

        <div className="goals-section">
          <h3>
            <FiTarget className="section-icon-small" />
            Study Goals
          </h3>
          <div className="goal-input">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              placeholder="Add a study goal..."
            />
            <button onClick={addGoal} className="add-goal-button">
              Add
            </button>
          </div>
          <div className="goals-list">
            {studyGoals.map(goal => (
              <div
                key={goal.id}
                className={`goal-item ${goal.completed ? 'completed' : ''}`}
                onClick={() => toggleGoal(goal.id)}
              >
                <FiCheckCircle className="goal-check" />
                <span>{goal.text}</span>
              </div>
            ))}
            {studyGoals.length === 0 && (
              <p className="empty-goals">No goals yet. Add one to get started!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPlanner;

