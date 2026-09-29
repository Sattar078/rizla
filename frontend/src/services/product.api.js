import api from './api';

export const productApi = {
  getProducts: async (params) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },
  getProductById: async (productId) => {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  },
};
