import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  getByKey: (key) => api.get(`/skills/${key}`),
  getByCategory: (category) => api.get(`/skills/category/${category}`),
  getCategories: () => api.get('/skills/categories'),
};

export const progressAPI = {
  getAll: () => api.get('/progress'),
  getDashboard: () => api.get('/progress/dashboard'),
  getSkillProgress: (skillKey) => api.get(`/progress/skill/${skillKey}`),
  updateProgress: (data) => api.post('/progress/update', data),
};

export default api;
