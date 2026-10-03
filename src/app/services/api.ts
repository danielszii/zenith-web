import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // <-- A porta onde o seu backend Node está rodando
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Adiciona o Token JWT no cabeçalho automaticamente se o usuário estiver logado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@zenith:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});