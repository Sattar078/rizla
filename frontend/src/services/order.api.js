import api from './api';

export const orderApi = {
  // Create the generic order (COD or Razorpay)
  createOrder: async (data) => {
    const response = await api.post('/api/orders', data);
    return response.data;
  },

  // Razorpay Initialization
  createRazorpayOrder: async (orderId) => {
    const response = await api.post(`/api/orders/${orderId}/razorpay`);
    return response.data;
  },

  // Razorpay Verification
  verifyRazorpayPayment: async ({ orderId, data }) => {
    const response = await api.post(`/api/orders/${orderId}/razorpay/verify`, data);
    return response.data;
  },

  // Razorpay Failure Handling
  handlePaymentFailure: async (orderId) => {
    const response = await api.post(`/api/orders/${orderId}/razorpay/fail`);
    return response.data;
  },

  // Get My Orders
  getMyOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  // Get Order By Id
  getOrderById: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  // Cancel Order
  cancelOrder: async (orderId) => {
    const response = await api.patch(`/api/orders/${orderId}/cancel`);
    return response.data;
  },

  // Get Order Receipt
  getOrderReceipt: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}/receipt`);
    return response.data;
  },
};
