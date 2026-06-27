const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

export const getToken = () => localStorage.getItem('feedback_token');
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('feedback_user'));
  } catch {
    return null;
  }
};

export const storeSession = ({ token, user }) => {
  localStorage.setItem('feedback_token', token);
  localStorage.setItem('feedback_user', JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem('feedback_token');
  localStorage.removeItem('feedback_user');
};

export async function api(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload.message || 'Request failed';
    throw new Error(message);
  }

  return payload;
}
