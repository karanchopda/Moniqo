export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

export const isLoggedIn = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
};
