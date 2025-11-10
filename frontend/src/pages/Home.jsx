import React from 'react';

const Home = ({ onShowSection }) => {
  return (
    <section id="home" className="section active">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Master Your Future</h1>
            <p>Your complete career guidance platform with interactive roadmaps, step-by-step learning paths, and comprehensive resources. Everything you need to build your dream career in one place.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => onShowSection('skills')}>
                🚀 Explore Skills
              </button>
              <button className="btn btn-outline" onClick={() => onShowSection('dashboard')}>
                📊 View Dashboard
              </button>
            </div>
          </div>

          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Interactive Roadmaps</h3>
              <p>Visual learning paths with step-by-step guidance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your learning journey and achievements</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Rich Resources</h3>
              <p>Curated tutorials, courses, and practice materials</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Career Focus</h3>
              <p>Industry-aligned skills and real-world projects</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
