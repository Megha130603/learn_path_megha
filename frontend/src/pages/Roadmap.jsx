import React, { useState, useEffect } from 'react';
import { skillsAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Roadmap = ({ skillKey, onShowSection }) => {
  const { user } = useAuth();
  const [skill, setSkill] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('flowchart');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkillData();
  }, [skillKey]);

  const loadSkillData = async () => {
    try {
      const [skillResponse, progressResponse] = await Promise.all([
        skillsAPI.getByKey(skillKey),
        user ? progressAPI.getSkillProgress(skillKey) : Promise.resolve({ data: { data: null } })
      ]);

      if (skillResponse.data.success) {
        setSkill(skillResponse.data.data);
      }

      if (progressResponse.data.success) {
        setProgress(progressResponse.data.data);
      }
    } catch (error) {
      console.error('Error loading skill data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChecklistToggle = async (stepIndex, itemIndex, completed) => {
    if (!user) return;

    try {
      await progressAPI.updateProgress({
        skillKey,
        stepIndex,
        itemIndex,
        completed: !completed
      });
      loadSkillData(); // Reload to get updated progress
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const isChecklistItemCompleted = (stepIndex, itemIndex) => {
    if (!progress || !progress.steps) return false;
    const step = progress.steps.get?.(stepIndex.toString());
    return step?.checklist?.get?.(itemIndex.toString()) || false;
  };

  if (loading) {
    return <div className="loading">Loading roadmap...</div>;
  }

  if (!skill) {
    return <div>Skill not found</div>;
  }

  return (
    <section id="roadmap" className="section active">
      <div className="container">
        <button className="btn back-btn" onClick={() => onShowSection('skills')}>
          ← Back to Skills
        </button>

        <div className="roadmap-header">
          <h2>{skill.title} Roadmap</h2>
          <p>Follow this structured path to master your chosen skill</p>
        </div>

        <div className="roadmap-tabs">
          <button 
            className={`tab-btn ${activeTab === 'flowchart' ? 'active' : ''}`}
            onClick={() => setActiveTab('flowchart')}
          >
            🗺️ Flowchart
          </button>
          <button 
            className={`tab-btn ${activeTab === 'steps' ? 'active' : ''}`}
            onClick={() => setActiveTab('steps')}
          >
            📋 Step-by-Step
          </button>
          <button 
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            📚 All Resources
          </button>
        </div>

        <div className="roadmap-content">
          {activeTab === 'flowchart' && (
            <div className="flowchart active">
              <div className="flowchart-container">
                {skill.roadmap.flowchart.map((level, levelIndex) => (
                  <div key={levelIndex} className="flow-level">
                    {level.map((item, itemIndex) => {
                      const stepProgress = progress?.steps?.get?.(levelIndex.toString());
                      const isCompleted = stepProgress?.checklist?.size > 0;
                      
                      return (
                        <div 
                          key={itemIndex}
                          className={`flow-node ${isCompleted ? 'completed' : ''}`}
                        >
                          {item}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="roadmap-steps active">
              {skill.roadmap.steps.map((step, stepIndex) => {
                const stepProgress = progress?.steps?.get?.(stepIndex.toString());
                const completedItems = stepProgress ? 
                  Array.from(stepProgress.checklist?.values() || []).filter(Boolean).length : 0;
                const stepCompletion = (completedItems / step.checklist.length) * 100;

                return (
                  <div 
                    key={stepIndex}
                    className={`roadmap-step ${stepCompletion === 100 ? 'completed' : ''}`}
                  >
                    <div className="step-header">
                      <div>
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-duration">⏰ {step.duration}</p>
                      </div>
                      <div className="step-duration">{Math.round(stepCompletion)}% Complete</div>
                    </div>
                    <p className="step-description">{step.description}</p>

                    <div className="step-checklist">
                      <h4 className="checklist-title">Learning Checklist</h4>
                      {step.checklist.map((item, itemIndex) => {
                        const isCompleted = isChecklistItemCompleted(stepIndex, itemIndex);
                        
                        return (
                          <div 
                            key={itemIndex}
                            className={`checklist-item ${isCompleted ? 'completed' : ''}`}
                            onClick={() => handleChecklistToggle(stepIndex, itemIndex, isCompleted)}
                          >
                            <div className={`checkbox ${isCompleted ? 'checked' : ''}`}></div>
                            <span className="checklist-text">{item}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="resources">
                      {step.resources.map((resource, resourceIndex) => (
                        <a 
                          key={resourceIndex}
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="resource-link"
                        >
                          {resource.type} {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="roadmap-steps active">
              {skill.roadmap.steps.map((step, stepIndex) => (
                <div key={stepIndex}>
                  <h3>{step.title} Resources</h3>
                  <div className="resources">
                    {step.resources.map((resource, resourceIndex) => (
                      <a 
                        key={resourceIndex}
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        {resource.type} {resource.title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
