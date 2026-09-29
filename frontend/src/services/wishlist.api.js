import api from './api';

export const wishlistApi = {
  getWishlist: async () => {
    const response = await api.get('/api/users/wishlist');
    return response.data;
  },
  addWishlist: async (productId) => {
    const response = await api.post(`/api/users/wishlist/${productId}`);
    return response.data;
  },
  removeWishlist: async (productId) => {
    const response = await api.delete(`/api/users/wishlist/${productId}`);
    return response.data;
  },
};
