export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  if (!token) return false;

  // Decode the JWT payload (no verification — just expiry check client-side)
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;
    const payload = JSON.parse(atob(payloadBase64));
    // exp is in seconds, Date.now() is in ms
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Token expired — clean up and treat as logged out
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
