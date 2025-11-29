import { useState } from 'react';
import { FiUpload, FiMessageCircle, FiFileText, FiLayers, FiClock, FiMapPin, FiArrowRight, FiBookOpen, FiInfo, FiAward, FiUsers, FiCalendar, FiLogOut, FiMap, FiGlobe, FiTarget } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';
import './LandingPage.css';

function LandingPage({ onGetStarted, onLogout, user }) {
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      icon: <FiUpload />,
      title: 'Upload Documents',
      description: 'Upload PDFs, Word docs, or text files to build your knowledge base',
      color: '#00A9B7'
    },
    {
      icon: <FiMessageCircle />,
      title: 'Ask Questions',
      description: 'Get instant answers about your study materials or any general question',
      color: '#006B7A'
    },
    {
      icon: <FiFileText />,
      title: 'Generate Quizzes',
      description: 'Create practice quizzes tailored to your study materials',
      color: '#FFD100'
    },
    {
      icon: <FiLayers />,
      title: 'Flashcards',
      description: 'Automatically generate flashcards from your documents',
      color: '#00A9B7'
    },
    {
      icon: <FiClock />,
      title: 'Study Planner',
      description: 'Use Pomodoro technique with focus sessions and study goals',
      color: '#006B7A'
    },
    {
      icon: <FiMapPin />,
      title: 'UNCW Resources',
      description: 'Quick access to library, STEM lab, and campus services',
      color: '#FFD100'
    }
  ];

  const uncwFacts = [
    {
      icon: <FiCalendar />,
      title: 'Founded',
      content: 'UNCW was established in 1947 as Wilmington College, becoming part of the UNC system in 1969.'
    },
    {
      icon: <FiUsers />,
      title: 'Student Body',
      content: 'Over 17,000 students enrolled across undergraduate and graduate programs, with a diverse and inclusive community.'
    },
    {
      icon: <FiAward />,
      title: 'Recognition',
      content: 'Ranked among the top public universities in the South by U.S. News & World Report. Recognized for excellence in teaching and research.'
    },
    {
      icon: <HiAcademicCap />,
      title: 'Academics',
      content: 'Offers more than 90 undergraduate degree programs and 30+ graduate programs across six colleges.'
    },
    {
      icon: <FiMap />,
      title: 'Location',
      content: 'Beautiful 661-acre campus located in Wilmington, North Carolina, just minutes from the Atlantic Ocean and Wrightsville Beach.'
    },
    {
      icon: <FiGlobe />,
      title: 'Research',
      content: 'Designated as a research university with strong programs in marine science, business, education, and health sciences.'
    },
    {
      icon: <FiTarget />,
      title: 'Mission',
      content: 'Dedicated to learning through teaching, scholarship, and service. Committed to student success and community engagement.'
    }
  ];

  return (
    <div className="landing-page">
      {user && (
        <div className="landing-user-bar">
          <span>
            Welcome back, {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}!
          </span>
          <button onClick={onLogout} className="logout-button-landing">
            <FiLogOut className="logout-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
      
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

      <div className="landing-tabs">
        <button
          className={activeTab === 'features' ? 'active' : ''}
          onClick={() => setActiveTab('features')}
        >
          <FiBookOpen className="tab-icon" />
          Features
        </button>
        <button
          className={activeTab === 'how-it-works' ? 'active' : ''}
          onClick={() => setActiveTab('how-it-works')}
        >
          <FiInfo className="tab-icon" />
          How It Works
        </button>
        <button
          className={activeTab === 'about-uncw' ? 'active' : ''}
          onClick={() => setActiveTab('about-uncw')}
        >
          <HiAcademicCap className="tab-icon" />
          About UNCW
        </button>
      </div>

      <div className="landing-content">
        {activeTab === 'features' && (
          <div className="features-section">
            <h2>Powerful Study Tools</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card" style={{ '--card-color': feature.color }}>
                  <div className="feature-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'how-it-works' && (
          <div className="how-it-works-section">
            <h2>How It Works</h2>
            <div className="steps-container">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Upload Your Materials</h3>
                  <p>Upload your lecture notes, textbooks, or study guides in PDF, Word, or text format. Our AI processes and indexes your documents for instant retrieval.</p>
                </div>
              </div>
              <div className="step-arrow">→</div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Ask Questions</h3>
                  <p>Get instant answers to any question - whether about your documents or general topics. Our AI provides comprehensive, detailed explanations tailored to your major.</p>
                </div>
              </div>
              <div className="step-arrow">→</div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Study Smarter</h3>
                  <p>Generate quizzes, create flashcards, and use the study planner to stay organized. Track your progress and achieve your academic goals.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about-uncw' && (
          <div className="about-uncw-section">
            <h2>About UNC Wilmington</h2>
            <div className="uncw-intro">
              <p>
                The University of North Carolina Wilmington is a public research university located in Wilmington, North Carolina. 
                Known for its beautiful coastal campus and strong academic programs, UNCW provides students with exceptional 
                educational opportunities in a vibrant learning environment.
              </p>
              <p>
                UNCW is part of the prestigious University of North Carolina system and is recognized for its commitment to 
                excellence in teaching, research, and service. The university offers a comprehensive range of programs through 
                its six colleges: College of Arts and Sciences, Cameron School of Business, Watson College of Education, 
                College of Health and Human Services, College of Science and Engineering, and the Graduate School.
              </p>
              <p>
                The campus features state-of-the-art facilities including the Randall Library, STEM Lab, and numerous research 
                centers. UNCW is particularly known for its programs in marine science, business, education, and health sciences, 
                with many programs ranked among the best in the nation.
              </p>
            </div>
            <div className="uncw-facts-grid">
              {uncwFacts.map((fact, index) => (
                <div key={index} className="fact-card">
                  <div className="fact-icon">{fact.icon}</div>
                  <h3>{fact.title}</h3>
                  <p>{fact.content}</p>
                </div>
              ))}
            </div>
            <div className="uncw-history">
              <h3>Our History</h3>
              <div className="history-timeline">
                <div className="timeline-item">
                  <div className="timeline-year">1947</div>
                  <div className="timeline-content">
                    <h4>Wilmington College Founded</h4>
                    <p>Established as a junior college to serve the Wilmington community.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">1969</div>
                  <div className="timeline-content">
                    <h4>Joined UNC System</h4>
                    <p>Became part of the University of North Carolina system, expanding academic offerings.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">1980s-90s</div>
                  <div className="timeline-content">
                    <h4>Rapid Growth</h4>
                    <p>Expanded academic programs and facilities, establishing itself as a comprehensive university.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2000s</div>
                  <div className="timeline-content">
                    <h4>Research University</h4>
                    <p>Achieved Carnegie classification as a research university, emphasizing both teaching and research excellence.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">Today</div>
                  <div className="timeline-content">
                    <h4>Leading University</h4>
                    <p>A comprehensive research university with over 17,000 students, recognized nationally for academic excellence, 
                    innovative programs, and commitment to student success. Home to nationally ranked programs in marine science, 
                    business, and education.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
