export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setAuth = (token, user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Dispatch custom event to notify components
    window.dispatchEvent(new Event('authChange'));
  }
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('lastNotificationCheck');
    // Dispatch custom event to notify components
    window.dispatchEvent(new Event('authChange'));
  }
};

export const isAdmin = () => {
  const user = getUser();
  return user && user.role === 'admin';
};