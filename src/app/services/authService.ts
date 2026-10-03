import { api } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    email: string;
    name: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Faz a chamada para a rota do seu backend Node
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }
};