import { useState } from 'react';
import { FiUpload, FiMessageCircle, FiFileText, FiLayers, FiClock, FiMapPin, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';
import './LandingPage.css';

function LandingPage({ onGetStarted }) {
  const features = [
    {
      icon: <FiUpload />,
      title: 'Upload Documents',
      description: 'Upload PDFs, Word docs, or text files to build your knowledge base'
    },
    {
      icon: <FiMessageCircle />,
      title: 'Ask Questions',
      description: 'Get instant answers about your study materials or any general question'
    },
    {
      icon: <FiFileText />,
      title: 'Generate Quizzes',
      description: 'Create practice quizzes tailored to your study materials'
    },
    {
      icon: <FiLayers />,
      title: 'Flashcards',
      description: 'Automatically generate flashcards from your documents'
    },
    {
      icon: <FiClock />,
      title: 'Study Planner',
      description: 'Use Pomodoro technique with focus sessions and study goals'
    },
    {
      icon: <FiMapPin />,
      title: 'UNCW Resources',
      description: 'Quick access to library, STEM lab, and campus services'
    }
  ];

  return (
    <div className="landing-page">
      <div className="landing-header">
        <div className="uncw-logo">
          <HiAcademicCap className="logo-icon" />
          <div className="logo-text">
            <span className="logo-uncw">UNCW</span>
            <span className="logo-study">Study Assistant</span>
          </div>
        </div>
        <h1>Your Personalized Study Companion</h1>
        <p className="landing-subtitle">
          Transform your study materials into interactive learning tools. 
          Powered by AI, designed for UNC Wilmington students.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="landing-description">
        <div className="description-content">
          <FiBookOpen className="description-icon" />
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload Your Materials</h3>
                <p>Upload your lecture notes, textbooks, or study guides in PDF, Word, or text format.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Ask Questions</h3>
                <p>Get instant answers to any question - whether about your documents or general topics.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Study Smarter</h3>
                <p>Generate quizzes, create flashcards, and use the study planner to stay organized.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-cta">
        <button onClick={onGetStarted} className="cta-button">
          <span>Get Started</span>
          <FiArrowRight className="cta-icon" />
        </button>
        <p className="cta-hint">Start studying smarter today!</p>
      </div>
    </div>
  );
}

export default LandingPage;

