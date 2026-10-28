import axios from 'axios';

const configuredUrl = String(import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');

if (import.meta.env.PROD && !configuredUrl) {
  throw new Error('VITE_API_URL não foi configurada para o ambiente de produção.');
}

export const api = axios.create({
  baseURL: configuredUrl || 'http://localhost:3000',
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@zenith:token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('@zenith:token');
      localStorage.removeItem('@zenith:user');
      window.dispatchEvent(new Event('zenith:session-expired'));
    }
    return Promise.reject(error);
  },
);