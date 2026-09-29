import api from './api';

export const authApi = {
  signup: async (data) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },
  login: async (data) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await api.put('/api/auth/change-password', data);
    return response.data;
  },
};
