import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer JWT Token automatically from Cookies or localStorage
api.interceptors.request.use(
  (config) => {
    let token = Cookies.get('eduassess_token');
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('eduassess_token') || undefined;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Unauthorized / Expired Tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear expired credentials
      Cookies.remove('eduassess_token');
      Cookies.remove('eduassess_user');
      localStorage.removeItem('eduassess_token');
      localStorage.removeItem('eduassess_user');
    }
    return Promise.reject(error);
  }
);

export default api;
