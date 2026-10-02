import api from './api';

export const adminApi = {
  getUsers: async () => {
    const response = await api.get('/api/users/admin');
    return response.data;
  },
  getUser: async (userId) => {
    const response = await api.get(`/api/users/admin/${userId}`);
    return response.data;
  },
  changeRole: async ({ userId, data }) => {
    const response = await api.patch(`/api/users/admin/${userId}/role`, data);
    return response.data;
  },
  updateCategory: async ({ categoryId, data }) => {
    const response = await api.put(`/api/categories/${categoryId}`, data);
    return response.data;
  },
  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/api/categories/${categoryId}`);
    return response.data;
  },
  createCategory: async (data) => {
    const response = await api.post('/api/categories', data);
    return response.data;
  },
  createProduct: async (data) => {
    const response = await api.post('/api/products', data);
    return response.data;
  },
  updateProduct: async ({ productId, data }) => {
    const response = await api.put(`/api/products/${productId}`, data);
    return response.data;
  },
  deleteProduct: async (productId) => {
    const response = await api.delete(`/api/products/${productId}`);
    return response.data;
  },
  deleteProductImage: async ({ productId, imageId }) => {
    const response = await api.delete(`/api/products/${productId}/images/${imageId}`);
    return response.data;
  },
  uploadProductImages: async (formData) => {
    const response = await api.post('/api/upload/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get('/api/orders/admin');
    return response.data;
  },
  getOrder: async (orderId) => {
    const response = await api.get(`/api/orders/admin/${orderId}`);
    return response.data;
  },
  updateOrderStatus: async ({ orderId, data }) => {
    const response = await api.patch(`/api/orders/admin/${orderId}/status`, data);
    return response.data;
  },
  getDashboard: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },
  broadcastNotification: async (data) => {
    const response = await api.post('/api/notifications/broadcast', data);
    return response.data;
  },
};
