import api from './api';

export const paymentApi = {
  createRazorpayOrder: async (orderId) => {
    const response = await api.post(`/api/orders/${orderId}/razorpay`);
    return response.data;
  },
  verifyRazorpayPayment: async ({ orderId, data }) => {
    const response = await api.post(`/api/orders/${orderId}/razorpay/verify`, data);
    return response.data;
  },
  handlePaymentFailure: async (orderId) => {
    const response = await api.post(`/api/orders/${orderId}/razorpay/fail`);
    return response.data;
  },
};
