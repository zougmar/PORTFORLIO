import axios from 'axios';

// Auto-detect API URL: use Vercel URL in production, or custom VITE_API_URL, or localhost
const getApiUrl = () => {
  // If custom API URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production on Vercel, use relative path (same domain)
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // Development: use localhost
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
