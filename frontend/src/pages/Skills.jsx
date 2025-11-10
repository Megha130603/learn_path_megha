import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../services/api';

const Skills = ({ onShowSection, onShowRoadmap }) => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
    loadCategories();
  }, []);

  const loadSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      if (response.data.success) {
        setSkills(response.data.data);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await skillsAPI.getCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === filter);

  if (loading) {
    return <div className="loading">Loading skills...</div>;
  }

  return (
    <section id="skills" className="section active">
      <div className="container">
        <button className="btn back-btn" onClick={() => onShowSection('home')}>
          ← Back to Home
        </button>

        <div className="skills-header">
          <h2>Choose Your Learning Path</h2>
          <p>Select skills that match your interests and career goals. Each skill comes with a complete roadmap and resources.</p>
        </div>

        <div className="skills-filter">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Skills
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="skills-grid">
          {filteredSkills.map(skill => (
            <div 
              key={skill._id} 
              className="skill-card"
              onClick={() => onShowRoadmap(skill.key)}
            >
              <div className="skill-header">
                <div className="skill-icon">{skill.icon}</div>
                <div className="skill-info">
                  <h3>{skill.title}</h3>
                  <div className="skill-level">
                    <span className={`level-badge level-${skill.level}`}>
                      {skill.level}
                    </span>
                  </div>
                </div>
              </div>
              <p className="skill-description">{skill.description}</p>
              <div className="skill-stats">
                <span className="skill-duration">⏰ {skill.duration}</span>
                <span className="skill-popularity">{skill.popularity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
