import api from './api';

export const categoryApi = {
  getCategories: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  },
};
