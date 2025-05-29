
import axios from 'axios';
import Auth from '../utils/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
});

// Add auth token to requests
apiClient.interceptors.request.use(config => {
  const token = Auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      Auth.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;