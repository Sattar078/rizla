import api from './api';

export const userApi = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  },
  getAddresses: async () => {
    const response = await api.get('/api/users/addresses');
    return response.data;
  },
  addAddress: async (data) => {
    const response = await api.post('/api/users/addresses', data);
    return response.data;
  },
  updateAddress: async ({ addressId, data }) => {
    const response = await api.put(`/api/users/addresses/${addressId}`, data);
    return response.data;
  },
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/api/users/addresses/${addressId}`);
    return response.data;
  },
};
