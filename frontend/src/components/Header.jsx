import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Header = ({ onShowAuthModal }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <nav className="nav container">
        <div className="logo">SkillPath</div>
        <div className="nav-buttons">
          {user ? (
            <div className="user-info logged-in">
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="welcome-text">Welcome, {user.username}!</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div id="authButtons">
              <button 
                className="btn btn-outline" 
                onClick={() => onShowAuthModal('login')}
              >
                Login
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => onShowAuthModal('signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
