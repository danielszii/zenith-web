import { api } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  usuario: {
    id: string;
    email: string;
    nome: string;
    role: 'admin' | 'mesario' | 'gestor';
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Faz a chamada para a rota do seu backend Node
    const response = await api.post<LoginResponse>('/auth/login', {
      email: credentials.email,
      senha: credentials.password,
    });
    return response.data;
  }
};
