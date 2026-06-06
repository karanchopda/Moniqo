import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 for non-auth routes
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
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

export interface TransactionQuery {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  search?: string;
}

export const transactionApi = {
  getAll:  (params?: TransactionQuery) => api.get('/transactions', { params }),
  create:  (data: any)   => api.post('/transactions', data),
  update:  (id: string, data: any) => api.put(`/transactions/${id}`, data),
  remove:  (id: string)  => api.delete(`/transactions/${id}`),
};

export const statementApi = {
  getAll:  () => api.get('/statements'),
  remove:  (id: string) => api.delete(`/statements/${id}`),
};

export const userApi = {
  getProfile:           () => api.get('/users/profile'),
  updateProfile:        (data: { name?: string; email?: string }) => api.put('/users/profile', data),
  changePassword:       (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/change-password', data),
  updateNotificationPrefs: (data: { emailAlerts: boolean; weeklyDigest: boolean; aiPrompts: boolean }) =>
    api.put('/users/notification-prefs', data),
};

export default api;
