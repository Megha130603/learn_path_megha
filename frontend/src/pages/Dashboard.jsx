import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';

const Dashboard = ({ onShowSection, onShowRoadmap }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    skillsStarted: 0,
    skillsCompleted: 0,
    totalProgress: 0,
    streakDays: 0
  });
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const response = await progressAPI.getDashboard();
      if (response.data.success) {
        setStats(response.data.data);
        setUserProgress(response.data.data.recentProgress || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section id="dashboard" className="section active">
        <div className="container">
          <button className="btn back-btn" onClick={() => onShowSection('home')}>
            ← Back to Home
          </button>
          <div className="login-prompt">
            <h2>Please log in to view your dashboard</h2>
            <p>Track your learning progress and achievements</p>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <section id="dashboard" className="section active">
      <div className="container">
        <button className="btn back-btn" onClick={() => onShowSection('home')}>
          ← Back to Home
        </button>

        <div className="skills-header">
          <h2>Your Learning Dashboard</h2>
          <p>Track your progress and see how far you've come</p>
        </div>

        <div className="progress-overview">
          <div className="progress-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.skillsStarted}</div>
              <div className="stat-label">Skills Started</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.skillsCompleted}</div>
              <div className="stat-label">Skills Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalProgress}%</div>
              <div className="stat-label">Overall Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.streakDays}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-label">
              <span>Overall Learning Progress</span>
              <span>{stats.totalProgress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.totalProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {userProgress.length > 0 ? (
          <div className="user-skills-progress">
            <h3>Your Skills Progress</h3>
            {userProgress.map(progress => (
              <div 
                key={progress._id}
                className="progress-overview" 
                onClick={() => onShowRoadmap(progress.skillId.key)}
              >
                <div className="progress-bar-container">
                  <div className="progress-label">
                    <span>{progress.skillId.icon} {progress.skillId.title}</span>
                    <span>{progress.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Start Your Learning Journey</h3>
            <p>Choose a skill to begin tracking your progress</p>
            <button className="btn btn-primary" onClick={() => onShowSection('skills')}>
              Browse Skills
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
