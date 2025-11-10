import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, mode }) => {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        await login({ username: formData.username, password: formData.password });
        setMessage('Login successful!');
      } else {
        await register(formData);
        setMessage('Registration successful!');
      }
      onClose();
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div id="authModal" className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {mode === 'login' ? 'Welcome Back' : 'Join SkillPath'}
          </h3>
          <p className="modal-subtitle">
            {mode === 'login' ? 'Sign in to continue your learning journey' : 'Start building your future today'}
          </p>
        </div>

        <form id="authForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username"
              className="form-input" 
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>
          
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="form-input" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              className="form-input" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
