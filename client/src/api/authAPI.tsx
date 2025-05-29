import axios from 'axios';
import { UserLogin } from "../interfaces/UserLogin";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const login = async (userInfo: UserLogin) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: userInfo.username,
      password: userInfo.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.token) {
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      // Store user data if needed (without sensitive information)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set default authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.error || 'Login failed');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server');
      }
    }
    // Something happened in setting up the request that triggered an Error
    throw new Error('Login request failed');
  }
};

export { login };