import axios from 'axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<void> => {
    await axios.post('http://localhost:8080/api/account/signup', userData);
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  logout: (): void => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Set auth token for axios requests
  setAuthToken: (token: string): void => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }
};

export default authService;