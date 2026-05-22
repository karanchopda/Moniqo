import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const reportApi = {
  getLatest: () => api.get('/report/latest'),
  smsScan: (smsText: string) => api.post('/report/sms-scan', { smsText }),
};

export const transactionApi = {
  getAll: () => api.get('/transactions'),
  create: (data: any) => api.post('/transactions', data),
};

export default api;
