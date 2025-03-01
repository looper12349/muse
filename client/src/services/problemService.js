// services/problemService.js
import api from '../utils/api';

export const createProblem = async (leetcodeUrl) => {
  try {
    const response = await api.post('/problems', { leetcodeUrl });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create problem' };
  }
};

export const getAllProblems = async (page = 1, limit = 25, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    
    const response = await api.get(`/problems?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch problems' };
  }
};

export const getProblemById = async (id) => {
  try {
    const response = await api.get(`/problems/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch problem' };
  }
};

export const getProblemsByDifficulty = async (difficulty) => {
  try {
    const response = await api.get(`/problems/difficulty/${difficulty}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch problems by difficulty' };
  }
};

export const getProblemsByTag = async (tag) => {
  try {
    const response = await api.get(`/problems/tag/${tag}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch problems by tag' };
  }
};

export const searchProblems = async (keyword) => {
  try {
    const response = await api.get(`/problems/search/${keyword}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to search problems' };
  }
};

export const refreshProblem = async (id) => {
  try {
    const response = await api.put(`/problems/${id}/refresh`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to refresh problem' };
  }
};