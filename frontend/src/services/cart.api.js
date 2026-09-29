import api from './api';

export const cartApi = {
  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data;
  },
  addToCart: async (data) => {
    const response = await api.post('/api/cart', data);
    return response.data;
  },
  updateQuantity: async ({ itemId, quantity }) => {
    const response = await api.put(`/api/cart/${itemId}`, { quantity });
    return response.data;
  },
  removeItem: async (itemId) => {
    const response = await api.delete(`/api/cart/${itemId}`);
    return response.data;
  },
  clearCart: async () => {
    const response = await api.delete('/api/cart');
    return response.data;
  },
};
