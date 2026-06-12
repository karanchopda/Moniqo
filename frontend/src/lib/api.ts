import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({ baseURL: BASE_URL });

// ─── Request: attach access token ────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response: auto-refresh on 401 ───────────────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(newToken: string) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Skip refresh for auth endpoints themselves and already-retried requests
    const isAuthEndpoint = original.url?.includes('/auth/');
    if (error.response?.status !== 401 || isAuthEndpoint || original._retry) {
      // Non-auth 401 → clear session and redirect
      if (error.response?.status === 401 && !isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Try to refresh the access token
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve) => {
        refreshQueue.push((newToken) => {
          if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken: storedRefreshToken,
      });

      const { token: newToken, refreshToken: newRefreshToken } = data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      if (data.user) {
        const stored = localStorage.getItem('user');
        const parsed = stored ? JSON.parse(stored) : {};
        localStorage.setItem('user', JSON.stringify({ ...parsed, ...data.user }));
      }

      processQueue(newToken);
      if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch {
      // Refresh failed — session truly expired
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

// ─── API surface ──────────────────────────────────────────────────────────────

export const reportApi = {
  getLatest:   () => api.get('/report/latest'),
  getRecurring: () => api.get('/report/recurring'),
  smsScan:     (smsText: string) => api.post('/report/sms-scan', { smsText }),
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
  create:  (data: any)  => api.post('/transactions', data),
  update:  (id: string, data: any) => api.put(`/transactions/${id}`, data),
  remove:  (id: string) => api.delete(`/transactions/${id}`),
};

export const statementApi = {
  getAll:  () => api.get('/statements'),
  remove:  (id: string) => api.delete(`/statements/${id}`),
};

export const userApi = {
  getProfile:              () => api.get('/users/profile'),
  updateProfile:           (data: { name?: string; email?: string }) => api.put('/users/profile', data),
  changePassword:          (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/change-password', data),
  updateNotificationPrefs: (data: { emailAlerts: boolean; weeklyDigest: boolean; aiPrompts: boolean }) =>
    api.put('/users/notification-prefs', data),
};

export const twoFactorApi = {
  getStatus:  () => api.get('/2fa/status'),
  setup:      () => api.post('/2fa/setup'),
  enable:     (code: string) => api.post('/2fa/enable', { code }),
  disable:    (data: { code: string; password: string }) => api.post('/2fa/disable', data),
  verifyLogin: (data: { tempToken: string; code: string }) => api.post('/auth/verify-2fa', data),
};

export const paymentApi = {
  getSubscription: () => api.get('/payments/subscription'),
  checkout: (plan: 'pro' | 'elite', interval: 'monthly' | 'yearly' = 'monthly') =>
    api.post('/payments/checkout', { plan, interval }),
  portal: () => api.post('/payments/portal'),
};

export default api;
