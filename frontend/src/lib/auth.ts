const BASE_URL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api')
    : '';

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  // Tell the backend to invalidate the refresh token (fire-and-forget)
  if (refreshToken && BASE_URL) {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch { /* ignore network errors on logout */ }
  }

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;
    const payload = JSON.parse(atob(payloadBase64));

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Access token expired — we have a refresh token so don't clear yet.
      // The axios interceptor will silently refresh on the next API call.
      // Only hard-logout if there's no refresh token either.
      if (!localStorage.getItem('refreshToken')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
      // Has refresh token → treat as still logged in (interceptor will renew)
      return true;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Store tokens returned by any auth response (login, signup, verify-email, etc.)
 */
export const storeAuthResponse = (data: {
  token: string;
  refreshToken?: string;
  user: object;
}) => {
  localStorage.setItem('token', data.token);
  if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  const stored = localStorage.getItem('user');
  const parsed = stored ? JSON.parse(stored) : {};
  localStorage.setItem('user', JSON.stringify({ ...parsed, ...data.user }));
};
