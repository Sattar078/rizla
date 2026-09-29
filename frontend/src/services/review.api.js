import api from './api';

export const reviewApi = {
  getReviews: async (productId) => {
    const response = await api.get(`/api/products/${productId}/reviews`);
    return response.data;
  },
  createReview: async ({ productId, data }) => {
    const response = await api.post(`/api/products/${productId}/reviews`, data);
    return response.data;
  },
  updateReview: async ({ productId, reviewId, data }) => {
    const response = await api.patch(`/api/products/${productId}/reviews/${reviewId}`, data);
    return response.data;
  },
  deleteReview: async ({ productId, reviewId }) => {
    const response = await api.delete(`/api/products/${productId}/reviews/${reviewId}`);
    return response.data;
  },
};
