import api from './api';

const TOKEN_KEY = 'dsa_assistant_token';

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const checkToken = async () => {
  const token = getToken();
  
  if (!token) {
    return false;
  }
  
  try {
    const response = await api.get('/auth/me');
    if (response.data.success) {
      return {
        user: response.data.data.user,
        token
      };
    } else {
      clearToken();
      return false;
    }
  } catch (error) {
    clearToken();
    return false;
  }
};