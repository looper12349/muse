// services/authService.js
import api from '../utils/api';
import { setToken, clearToken } from '../utils/tokenManager';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      setToken(response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Registration failed' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      setToken(response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

export const logoutUser = () => {
  clearToken();
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to get user' };
  }
};