import axios from 'axios';

// Auto-detect API URL: use Vercel URL in production, or custom VITE_API_URL, or localhost
const getApiUrl = () => {
  // If custom API URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in production (not localhost)
  const isProduction = typeof window !== 'undefined' && 
    !window.location.hostname.includes('localhost') && 
    !window.location.hostname.includes('127.0.0.1');
  
  // Also check Vite's PROD flag as fallback
  const isViteProd = import.meta.env.PROD === true || import.meta.env.MODE === 'production';
  
  // In production (Vercel), use relative path (same domain)
  if (isProduction || isViteProd) {
    console.log('🌐 Using production API URL: /api');
    return '/api';
  }
  
  // Development: use localhost
  console.log('🔧 Using development API URL: http://localhost:5000/api');
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
console.log('📡 API Base URL:', API_URL);

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
