import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import AuthModal from './components/AuthModal.jsx';
import Home from './pages/Home.jsx';
import Skills from './pages/Skills.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Roadmap from './pages/Roadmap.jsx';
import './styles/App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login'
  });

  const showSection = (section) => {
    setCurrentSection(section);
    setSelectedSkill(null);
  };

  const showRoadmap = (skillKey) => {
    setSelectedSkill(skillKey);
    setCurrentSection('roadmap');
  };

  const showAuthModal = (mode) => {
    setAuthModal({
      isOpen: true,
      mode: mode
    });
  };

  const closeAuthModal = () => {
    setAuthModal({
      isOpen: false,
      mode: 'login'
    });
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return <Home onShowSection={showSection} />;
      case 'skills':
        return <Skills onShowSection={showSection} onShowRoadmap={showRoadmap} />;
      case 'dashboard':
        return <Dashboard onShowSection={showSection} onShowRoadmap={showRoadmap} />;
      case 'roadmap':
        return selectedSkill ? (
          <Roadmap 
            skillKey={selectedSkill} 
            onShowSection={showSection} 
          />
        ) : (
          <div>No skill selected</div>
        );
      default:
        return <Home onShowSection={showSection} />;
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        <Header onShowAuthModal={showAuthModal} />
        <main className="main-content">
          {renderCurrentSection()}
        </main>
        
        <AuthModal 
          isOpen={authModal.isOpen}
          onClose={closeAuthModal}
          mode={authModal.mode}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
