import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reportApi = {
  getLatest: () => api.get('/report/latest'),
};

export const transactionApi = {
  getAll: () => api.get('/transactions'),
};

export default api;
