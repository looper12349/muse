// services/threadService.js
import api from '../utils/api';

export const createThread = async (problemId, llmProvider = 'openai') => {
  try {
    const response = await api.post('/threads', { problemId, llmProvider });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create thread' };
  }
};

export const getThreads = async () => {
  try {
    const response = await api.get('/threads');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch threads' };
  }
};

export const getThread = async (id) => {
  try {
    const response = await api.get(`/threads/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch thread' };
  }
};

export const updateThread = async (id, title) => {
  try {
    const response = await api.put(`/threads/${id}`, { title });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update thread' };
  }
};

export const deleteThread = async (id) => {
  try {
    const response = await api.delete(`/threads/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete thread' };
  }
};

export const updateLlmProvider = async (id, llmProvider) => {
  try {
    const response = await api.put(`/threads/${id}/llm`, { llmProvider });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update LLM provider' };
  }
};

export const sendMessage = async (threadId, content) => {
  try {
    const response = await api.post(`/threads/${threadId}/messages`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to send message' };
  }
};